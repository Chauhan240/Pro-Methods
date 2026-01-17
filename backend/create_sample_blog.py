"""
Script to create a sample blog post in the database
Run this after creating a user account
"""

from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import User, Blog
from datetime import datetime
import json

def create_sample_blog():
    init_db()
    db = SessionLocal()

    try:
        # Check if we have any users
        user = db.query(User).first()
        if not user:
            print("ERROR: No users found in database. Please create a user account first.")
            print("You can do this by signing up at http://localhost:3000/signup")
            return

        print(f"SUCCESS: Found user: {user.full_name} (ID: {user.id})")

        # Check if sample blog already exists
        existing_blog = db.query(Blog).filter(Blog.title == "Transform Your Life: The Ultimate Guide to Starting Your Fitness Journey").first()
        if existing_blog:
            print("WARNING: Sample blog already exists!")
            return

        # Sample blog content with rich formatting
        blog_content = """
<h2>Introduction: Why Fitness Matters</h2>

<p>Starting a fitness journey can feel overwhelming, but it doesn't have to be. Whether you're looking to <strong>lose weight</strong>, <strong>build muscle</strong>, or simply improve your overall health, taking that first step is the most important decision you'll ever make.</p>

<blockquote>
"The only bad workout is the one that didn't happen." - Unknown
</blockquote>

<h2>1. Set Clear, Achievable Goals</h2>

<p>Before you begin, it's crucial to define what success looks like for you. Are you aiming to:</p>

<ul>
<li>Lose 20 pounds in 3 months?</li>
<li>Run your first 5K?</li>
<li>Gain muscle mass and strength?</li>
<li>Improve your flexibility and mobility?</li>
</ul>

<p><em>Remember</em>: Goals should be <strong>SMART</strong> - Specific, Measurable, Achievable, Relevant, and Time-bound.</p>

<h2>2. Start with the Basics</h2>

<p>You don't need fancy equipment or an expensive gym membership to begin. Here's what you can do right now:</p>

<h3>Bodyweight Exercises</h3>

<ol>
<li><strong>Push-ups</strong> - Great for chest, shoulders, and triceps</li>
<li><strong>Squats</strong> - Essential for leg development</li>
<li><strong>Planks</strong> - Core strength is everything</li>
<li><strong>Lunges</strong> - Build balance and leg strength</li>
</ol>

<p>Start with 3 sets of 10 reps for each exercise, 3 times per week.</p>

<h2>3. Nutrition: The Foundation of Success</h2>

<p>Exercise is only <u>half the battle</u>. Your diet plays an even bigger role in achieving your fitness goals. Here are the fundamentals:</p>

<h3>Key Principles</h3>

<ul>
<li><strong>Protein</strong>: Aim for 0.8-1g per pound of body weight</li>
<li><strong>Hydration</strong>: Drink at least 8 glasses of water daily</li>
<li><strong>Whole Foods</strong>: Choose minimally processed options</li>
<li><strong>Meal Prep</strong>: Plan your meals to avoid poor choices</li>
</ul>

<blockquote>
"Abs are made in the kitchen, not in the gym."
</blockquote>

<h2>4. Progressive Overload: The Secret to Growth</h2>

<p>To see continuous improvement, you need to challenge your body progressively. This means:</p>

<ol>
<li>Increasing weight over time</li>
<li>Adding more repetitions</li>
<li>Reducing rest time between sets</li>
<li>Improving form and range of motion</li>
</ol>

<p><strong>Pro Tip:</strong> Track your workouts in a journal or app to monitor progress!</p>

<h2>5. Rest and Recovery</h2>

<p>Many beginners make the mistake of thinking <em>more is better</em>. The truth is, your muscles grow during rest, not during workouts.</p>

<h3>Recovery Essentials</h3>

<ul>
<li>Sleep 7-9 hours per night</li>
<li>Take at least 1-2 rest days per week</li>
<li>Consider active recovery (light walking, yoga)</li>
<li>Listen to your body - pain is different from soreness</li>
</ul>

<h2>6. Stay Consistent and Patient</h2>

<p>Rome wasn't built in a day, and neither is your dream physique. <strong>Consistency beats intensity</strong> every single time.</p>

<p>Here's what you can expect:</p>

<ul>
<li><strong>Week 1-2:</strong> Initial soreness and adaptation</li>
<li><strong>Week 3-4:</strong> Energy levels improve, routine becomes habit</li>
<li><strong>Month 2-3:</strong> Visible changes in body composition</li>
<li><strong>Month 6+:</strong> Significant transformation and lifestyle change</li>
</ul>

<h2>Common Mistakes to Avoid</h2>

<ol>
<li><s>Doing too much too soon</s> - Start slow and build up</li>
<li><s>Neglecting form for heavier weights</s> - Quality over quantity</li>
<li><s>Comparing yourself to others</s> - Your journey is unique</li>
<li><s>Skipping warm-ups</s> - Prevent injuries with proper preparation</li>
</ol>

<h2>Final Thoughts</h2>

<p>Your fitness journey is a <strong>marathon, not a sprint</strong>. There will be ups and downs, but every step forward counts. Remember why you started, celebrate small victories, and never give up on yourself.</p>

<p>At Pro Methods, we're here to support you every step of the way. Whether you need personalized training plans, nutrition guidance, or just motivation to keep going, we've got your back.</p>

<blockquote>
"The body achieves what the mind believes. Start believing in yourself today!"
</blockquote>

<p><strong>Ready to take action?</strong> Head to our <a href="/dashboard/workouts">workout section</a> to start your first training program today!</p>

<h3>Join Our Community</h3>

<p>Connect with thousands of fitness enthusiasts, share your progress, and get inspired by others' transformations. Together, we're stronger!</p>
"""

        # Video links
        video_links = [
            "https://www.youtube.com/watch?v=IODxDxX7oi4",  # Example fitness video
            "https://www.youtube.com/watch?v=1HIxPnRHYBo"   # Example workout guide
        ]

        # Create the blog
        sample_blog = Blog(
            title="Transform Your Life: The Ultimate Guide to Starting Your Fitness Journey",
            slug="transform-your-life-ultimate-guide-starting-fitness-journey",
            content=blog_content,
            description="A comprehensive beginner's guide to kickstarting your fitness journey with practical tips, nutrition advice, and proven strategies for long-term success.",
            author_id=user.id,
            cover_image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop",
            video_links=json.dumps(video_links),
            is_published=True,
            published_at=datetime.utcnow()
        )

        db.add(sample_blog)
        db.commit()
        db.refresh(sample_blog)

        print("SUCCESS: Sample blog created successfully!")
        print(f"Title: {sample_blog.title}")
        print(f"Slug: {sample_blog.slug}")
        print(f"Author: {user.full_name}")
        print(f"Published: {sample_blog.published_at}")
        print(f"\nView it at: http://localhost:3000/blogs/{sample_blog.slug}")

    except Exception as e:
        print(f"ERROR: Error creating sample blog: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating sample blog post...\n")
    create_sample_blog()
