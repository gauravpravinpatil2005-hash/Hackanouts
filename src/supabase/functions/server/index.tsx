import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-86043ce1/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= AUTHENTICATION ROUTES =============

// Sign up new user
app.post("/make-server-86043ce1/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Create user with auto-confirmed email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user profile data
    const userId = data.user.id;
    await kv.set(`user:${userId}:profile`, {
      id: userId,
      name,
      email,
      ecoScore: 0,
      level: 1,
      points: 0,
      streak: 0,
      co2Saved: 0,
      weeklyPoints: 0,
      activities: 0,
      joinedDate: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });

    return c.json({ 
      success: true, 
      user: data.user,
      message: "Account created successfully!" 
    });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Sign in user
app.post("/make-server-86043ce1/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Error signing in user: ${error.message}`);
      // Provide more helpful error messages
      if (error.message.includes('Invalid login credentials')) {
        return c.json({ 
          error: "Invalid email or password. Please check your credentials or sign up for a new account." 
        }, 400);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      session: data.session,
      user: data.user 
    });
  } catch (error) {
    console.log(`Server error during signin: ${error}`);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// ============= USER PROFILE ROUTES =============

// Get user profile
app.get("/make-server-86043ce1/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}:profile`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log(`Error fetching user profile: ${error}`);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-86043ce1/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}:profile`) || {};
    
    const updatedProfile = { ...currentProfile, ...updates };
    await kv.set(`user:${user.id}:profile`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.log(`Error updating user profile: ${error}`);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// ============= ACTIVITIES ROUTES =============

// Create activity
app.post("/make-server-86043ce1/activities", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const activityData = await c.req.json();
    const activityId = `activity:${user.id}:${Date.now()}`;
    
    const activity = {
      ...activityData,
      id: activityId,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(activityId, activity);

    // Update user profile stats
    const profile = await kv.get(`user:${user.id}:profile`) || {};
    const updatedProfile = {
      ...profile,
      ecoScore: (profile.ecoScore || 0) + (activityData.points || 0),
      points: (profile.points || 0) + (activityData.points || 0),
      weeklyPoints: (profile.weeklyPoints || 0) + (activityData.points || 0),
      co2Saved: (profile.co2Saved || 0) + (parseFloat(activityData.co2Saved) || 0),
      activities: (profile.activities || 0) + 1,
    };
    await kv.set(`user:${user.id}:profile`, updatedProfile);

    return c.json({ success: true, activity, profile: updatedProfile });
  } catch (error) {
    console.log(`Error creating activity: ${error}`);
    return c.json({ error: "Failed to create activity" }, 500);
  }
});

// Get user activities
app.get("/make-server-86043ce1/activities", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const activities = await kv.getByPrefix(`activity:${user.id}:`);
    
    // Sort by createdAt descending
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ activities });
  } catch (error) {
    console.log(`Error fetching activities: ${error}`);
    return c.json({ error: "Failed to fetch activities" }, 500);
  }
});

// ============= LEADERBOARD ROUTES =============

// Get leaderboard
app.get("/make-server-86043ce1/leaderboard", async (c) => {
  try {
    const timeFilter = c.req.query('time') || 'week';
    
    const profiles = await kv.getByPrefix('user:');
    const users = profiles
      .filter(p => p.id && p.ecoScore !== undefined)
      .map((profile, index) => ({
        ...profile,
        rank: index + 1,
        trend: 'up' as const,
      }))
      .sort((a, b) => {
        if (timeFilter === 'week') {
          return (b.weeklyPoints || 0) - (a.weeklyPoints || 0);
        }
        return (b.ecoScore || 0) - (a.ecoScore || 0);
      })
      .map((user, index) => ({ ...user, rank: index + 1 }));

    return c.json({ leaderboard: users });
  } catch (error) {
    console.log(`Error fetching leaderboard: ${error}`);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

// ============= UPLOADS ROUTES =============

// Create upload (proof of eco-activity)
app.post("/make-server-86043ce1/uploads", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const uploadData = await c.req.json();
    const uploadId = `upload:${user.id}:${Date.now()}`;
    
    const upload = {
      ...uploadData,
      id: uploadId,
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      verifiedBy: null,
    };

    await kv.set(uploadId, upload);

    return c.json({ success: true, upload });
  } catch (error) {
    console.log(`Error creating upload: ${error}`);
    return c.json({ error: "Failed to create upload" }, 500);
  }
});

// Get user uploads
app.get("/make-server-86043ce1/uploads", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const uploads = await kv.getByPrefix(`upload:${user.id}:`);
    
    uploads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ uploads });
  } catch (error) {
    console.log(`Error fetching uploads: ${error}`);
    return c.json({ error: "Failed to fetch uploads" }, 500);
  }
});

// ============= NGO EVENTS ROUTES =============

// Get all events
app.get("/make-server-86043ce1/events", async (c) => {
  try {
    const events = await kv.getByPrefix('event:');
    
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return c.json({ events });
  } catch (error) {
    console.log(`Error fetching events: ${error}`);
    return c.json({ error: "Failed to fetch events" }, 500);
  }
});

// Join event
app.post("/make-server-86043ce1/events/:eventId/join", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const eventId = c.req.param('eventId');
    const participationId = `event_participation:${user.id}:${eventId}`;
    
    await kv.set(participationId, {
      userId: user.id,
      eventId,
      joinedAt: new Date().toISOString(),
    });

    return c.json({ success: true, message: 'Successfully joined event!' });
  } catch (error) {
    console.log(`Error joining event: ${error}`);
    return c.json({ error: "Failed to join event" }, 500);
  }
});

// ============= COMMUNITY ROUTES =============

// Create community post
app.post("/make-server-86043ce1/community/posts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postData = await c.req.json();
    const postId = `post:${Date.now()}`;
    
    const profile = await kv.get(`user:${user.id}:profile`);
    
    const post = {
      ...postData,
      id: postId,
      userId: user.id,
      userName: profile?.name || 'Unknown User',
      userAvatar: profile?.avatar || '',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };

    await kv.set(postId, post);

    return c.json({ success: true, post });
  } catch (error) {
    console.log(`Error creating community post: ${error}`);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// Get community posts
app.get("/make-server-86043ce1/community/posts", async (c) => {
  try {
    const posts = await kv.getByPrefix('post:');
    
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ posts });
  } catch (error) {
    console.log(`Error fetching community posts: ${error}`);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

// Like a post
app.post("/make-server-86043ce1/community/posts/:postId/like", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(postId);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const updatedPost = {
      ...post,
      likes: (post.likes || 0) + 1,
    };

    await kv.set(postId, updatedPost);

    return c.json({ success: true, post: updatedPost });
  } catch (error) {
    console.log(`Error liking post: ${error}`);
    return c.json({ error: "Failed to like post" }, 500);
  }
});

// ============= BADGES ROUTES =============

// Get user badges
app.get("/make-server-86043ce1/badges", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userBadges = await kv.getByPrefix(`badge:${user.id}:`);

    return c.json({ badges: userBadges });
  } catch (error) {
    console.log(`Error fetching badges: ${error}`);
    return c.json({ error: "Failed to fetch badges" }, 500);
  }
});

// Award badge to user
app.post("/make-server-86043ce1/badges/award", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const badgeData = await c.req.json();
    const badgeId = `badge:${user.id}:${badgeData.type}`;
    
    const badge = {
      ...badgeData,
      id: badgeId,
      userId: user.id,
      earnedAt: new Date().toISOString(),
    };

    await kv.set(badgeId, badge);

    return c.json({ success: true, badge });
  } catch (error) {
    console.log(`Error awarding badge: ${error}`);
    return c.json({ error: "Failed to award badge" }, 500);
  }
});

// Initialize some demo events if none exist
async function initializeDemoData() {
  const existingEvents = await kv.getByPrefix('event:');
  
  if (existingEvents.length === 0) {
    const demoEvents = [
      {
        id: 'event:1',
        title: 'Beach Cleanup Drive',
        organizer: 'Ocean Guardians NGO',
        date: '2025-11-15',
        time: '9:00 AM - 12:00 PM',
        location: 'Marina Beach',
        description: 'Join us for a community beach cleanup event!',
        points: 150,
        participants: 45,
        maxParticipants: 100,
        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5',
        category: 'cleanup',
      },
      {
        id: 'event:2',
        title: 'Tree Planting Campaign',
        organizer: 'Green Earth Foundation',
        date: '2025-11-20',
        time: '7:00 AM - 11:00 AM',
        location: 'City Park',
        description: 'Plant 500 trees and make a difference!',
        points: 200,
        participants: 78,
        maxParticipants: 150,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
        category: 'planting',
      },
    ];

    for (const event of demoEvents) {
      await kv.set(event.id, event);
    }
  }
}

// Initialize demo data on server start
initializeDemoData().catch(console.error);

Deno.serve(app.fetch);
