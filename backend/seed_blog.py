from main import app, get_db
from models import Blog, Base
from schemas import BlogCreate
from database import SessionLocal, engine

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed_blog():
    db = SessionLocal()
    try:
        # Check if blog exists
        if db.query(Blog).count() == 0:
            blog = Blog(
                title="The Power of Consistency",
                content="Consistency is the key to unlocking your fitness potential. It's not about the intensity of a single workout, but the dedication to show up every day. In this journey, we explore how small, daily habits compound over time to create massive results.",
                author="Nishant Jain",
                image="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
            )
            db.add(blog)
            db.commit()
            print("✅ Sample blog created successfully!")
        else:
            print("ℹ️  Blogs already exist.")
    except Exception as e:
        print(f"❌ Failed to seed blog: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_blog()
