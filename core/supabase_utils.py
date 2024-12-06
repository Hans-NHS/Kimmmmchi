import requests
from decouple import config

from supabase import create_client
from django.conf import settings

SUPABASE_URL = config("SUPABASE_URL")
SUPABASE_KEY = config("SUPABASE_KEY")

headers = {
"apikey": SUPABASE_KEY,
"Content-Type": "application/json",
"Authorization": f"Bearer {SUPABASE_KEY}"
}

#initialize supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_data(table_name, filters=None):
    query = supabase.table(table_name).select("*")
    if filters:
        for column, value in filters.items():
            query = query.eq(column, value)
    response = query.execute()
    return response.data

def insert_data(table, data):
    try:
        # Insert the data into the Supabase table
        response = supabase.table(table).insert(data).execute()

        # Check if there is an error in the response
        if response.error:
            raise ValueError(f"Supabase insert error: {response.error}")
        
        # If no error, return the inserted data
        return response.data

    except Exception as e:
        print(f"Error in insert_data: {e}")
        return None
