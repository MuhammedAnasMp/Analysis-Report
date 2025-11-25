import oracledb
from datetime import datetime

# -----------------------------
# Database connection
# -----------------------------
def connection():
    username = "KHYPER"
    password = "KHYPER"
    dsn = "192.168.2.171:1521/ZEDEYE"
    client_path = r"C:\instantclient_19_5"  

    try:
        oracledb.init_oracle_client(lib_dir=client_path)
        conn = oracledb.connect(user=username, password=password, dsn=dsn)
        return conn
    except Exception as e:
        print("❌ Error connecting to Oracle Database:", e)
        raise

# -----------------------------
# Main script
# -----------------------------
def main():
    # Fixed list of locations
    location_ids =[826,462,827,828]

    # Updated date
    date_str = "14-NOV-25"
    date_obj = datetime.strptime(date_str, "%d-%b-%y")

    conn = connection()
    cursor = conn.cursor()

    try:
        for loc_code in location_ids:
            try:
                # Call the stored procedure
                cursor.callproc("KWT_DAILY_GP_RECHECK", [loc_code, date_obj])
                # Commit after each call to reduce locking/deadlocks
                conn.commit()
                print(f"✅ Successfully processed LOCATION_ID={loc_code}")
            except oracledb.Error as e:
                print(f"❌ Error processing LOCATION_ID={loc_code}: {e}")
                # Optional: rollback this single iteration if needed
                conn.rollback()

        print("All done!")

    finally:
        cursor.close()
        conn.close()
        print("Database connection closed.")

# -----------------------------
if __name__ == "__main__":
    main()
