from supabase import create_client, Client
from decouple import config

# Initialize the Supabase client
SUPABASE_URL = config("SUPABASE_URL")
SUPABASE_KEY = config("SUPABASE_KEY")

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)