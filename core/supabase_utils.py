import requests
from decouple import config

from supabase import create_client
from django.conf import settings

import logging
logger = logging.getLogger(__name__)

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

        # Log the response for debugging
        logger.debug(f"Insert response for table '{table}': {response}")

        # Check if the response has data
        if not response.data:
            raise ValueError("No data returned from Supabase insert.")

        # Return the inserted data
        return response.data

    except Exception as e:
        logger.error(f"Error in insert_data: {e}")
        return None

def update_data(table, user_id, data):
    try:
        # Update the existing record in the Supabase table by matching user_id
        response = supabase.table(table).update(data).eq('user_id', user_id).execute()

        # Log the response for debugging
        logger.debug(f"Update response for table '{table}': {response}")

        # Check if the response has data
        if not response.data:
            raise ValueError("No data returned from Supabase update.")

        # Return the updated data
        return response.data

    except Exception as e:
        logger.error(f"Error in update_data: {e}")
        return None
