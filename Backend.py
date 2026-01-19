import base64,os
from flask import Flask, jsonify
import oracledb
from flask_cors import CORS
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
from dotenv import load_dotenv
load_dotenv() 

def connection():
    username = os.getenv("ORACLE_USERNAME")
    password = os.getenv("ORACLE_PASSWORD")
    dsn = os.getenv("ORACLE_DSN")
    client_path = os.getenv("ORACLE_CLIENT_PATH")

    try:
        print("Initializing Oracle client...")
        oracledb.init_oracle_client(lib_dir=client_path)
        print("Connecting to Oracle Database...")
        conn = oracledb.connect(user=username, password=password, dsn=dsn)
        print("Connected to Oracle Database successfully!")
        return conn
    except oracledb.Error as e:
        print("❌ Error connecting to Oracle Database:", e)
        raise
    except Exception as e:
        print("❌ Unexpected error in connection:", e)
        raise


def connection_v6_menu():
    username=os.getenv("ORACLE_USERNAME2")
    password=os.getenv("ORACLE_PASSWORD2")
    dsn=os.getenv("ORACLE_DSN2")
    client_path=os.getenv("ORACLE_CLIENT_PATH2")

    try:
        print("Initializing Oracle client...")
        oracledb.init_oracle_client(lib_dir=client_path)
        print("Connecting to Oracle Database...")
        conn = oracledb.connect(user=username, password=password, dsn=dsn)
        print("Connected to Oracle Database successfully!")
        return conn
    except oracledb.Error as e:
        print("❌ Error connecting to Oracle Database:", e)
        raise
    except Exception as e:
        print("❌ Unexpected error in connection:", e)
        raise


@app.route("/api/target-vs-achievement", methods=['GET', 'POST'])
def salestable():
    if request.method == 'GET':

        yyyymm = request.args.get("yyyymm")        # e.g., "202510"
        location = request.args.get("location")  # e.g., "ST01"

        conn = connection()
        cur = conn.cursor()

        sql_query = """
             SELECT 
                SEC_CODE,
                SEC_NAME,
                TOTAL_BUDGET,
                BUD_AVG,
                TILL_SALES,
                TILL_SALES/31 AS AVG_SALE,
                REMARK,
                LOC_CODE,
                YYYYMM,
                NVL(TILL_SALES,0) - NVL(TOTAL_BUDGET,0) AS DIFFERENCE,
                CASE 
                    WHEN NVL(TILL_SALES,0) = 0 THEN 0
                    ELSE ROUND((NVL(TILL_SALES,0) - NVL(TOTAL_BUDGET,0)) / NVL(TOTAL_BUDGET,0) * 100, 2)
                END AS DIF_PERC
            FROM 
                KWT_PPT_SALES_BUDGET A
            WHERE 
                LOC_CODE = :loc
                AND YYYYMM = :yyyymm
            ORDER BY 
                SEC_CODE
            """

        print({'loc': location, 'yyyymm': yyyymm})
        cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
        columns = [col[0] for col in cur.description]

        cur.execute(sql_query)

        columns = [col[0] for col in cur.description]

        results = []
        for row in cur.fetchall():
            row_dict = dict(zip(columns, row))

            # Remove unwanted keys
            for bad_key in ['', "''", None, 'BUDGET']:
                if bad_key in row_dict:
                    row_dict.pop(bad_key)

            # Trim spaces only in SEC_CODE
            if 'SEC_CODE' in row_dict and isinstance(row_dict['SEC_CODE'], str):
                row_dict['SEC_CODE'] = row_dict['SEC_CODE'].strip()

            results.append(row_dict)

        cur.close()
        conn.close()

        return jsonify(results)

    else:
        data = request.get_json()
        remark = data.get('remark') if 'remark' in data else data.get('REMARK')
        loc_code = data.get('LOC_CODE')
        yyyymm = data.get('YYYYMM')
        yyyymm = data.get('YYYYMM')
        sec_code = data.get('SEC_CODE')

        try:

            conn = connection()
            cur = conn.cursor()

            sql_update = """
                UPDATE KWT_PPT_SALES_BUDGET
                SET REMARK = :remark
                WHERE LOC_CODE = :loc_code
                AND YYYYMM = :yyyymm
                AND trim(SEC_CODE) = trim(:sec_code)
            """

            cur.execute(sql_update, {
                'remark': remark,
                'loc_code': loc_code,
                'yyyymm': yyyymm,
                'sec_code': sec_code
            })

            conn.commit()
            updated_rows = cur.rowcount

            cur.close()
            conn.close()

            if updated_rows == 0:
                return jsonify({
                    "success": False,
                    "message": f"No record found for SEC_CODE={sec_code}, LOC_CODE={loc_code}, YYYYMM={yyyymm}"
                }), 404

            return jsonify({
                "success": True,
                "message": f"Remark updated for section {sec_code}",
                "data": {
                    "SEC_CODE": sec_code,
                    "LOC_CODE": loc_code,
                    "YYYYMM": yyyymm,
                    "REMARK": remark
                }
            }), 200

        except Exception as e:
            return jsonify({
                "success": False,
                "message": str(e)
            }), 500


@app.route('/api/stockvsageing', methods=['GET'])
def stockvsageing():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
            SELECT SEC_CODE,SEC_NAME,SKU_COUNT,STOCK_QTY, VALUE, AGE_180, AGE_365, AGE_ABOVE730, MONTH_SALES, MONTH_SALES-MONTH_COST PROFIT, MONTH_COST ,AVG_COST_DAY ,
            ROUND((MONTH_SALES-MONTH_COST)/MONTH_SALES *100,2) GP_PERC,
            ROUND(VALUE/AVG_COST_DAY,2) STOCK_dAYS
            FROM KWT_PPT_STOCK_VS_SALES
            WHERE LOC=:loc
            AND YYYYMM=:yyyymm 
            ORDER BY 1
            """

    cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/month-wise-sales-comparison', methods=['GET'])
def monthwisesalescomparison():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
            SELECT distinct to_char(doc_Date,'MM-MONTH')MM,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2025 THEN SALE_vALUE END),0)SALES25,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2024 THEN SALE_vALUE END),0)SALES24,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2023 THEN SALE_vALUE END),0)SALES23,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2022 THEN SALE_vALUE END),0)SALES22
            FROM KWT_LIVE_sALE_SUMMARY_dETL
            WHERE LOC_CODE=:loc
            AND TO_CHAR(DOC_dATE,'YYYYMM')<=:yyyymm
            AND DOC_dATE>='01-JAN-21'
            GROUP BY to_char(doc_Date,'MM-MONTH')
            ORDER BY 1
            """

    cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/fast-line', methods=['GET'])
def fastline():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
           SELECT DISTINCT LOC,GET_LOC_NAME(LOC)LOCATION,SECTION_CODE,
                    SECTION_NAME ,COUNT(*)SKU_COUNT,COUNT(*)-SUM(TOTAL_OOS) STOCK_SKU,
                    NVL(SUM(CASE WHEN LOC_STK<0 THEN 1 END),0)NEG_sTOCK,
                    NVL(SUM(CASE WHEN WH_sTK>=50 THEN 1 END),0)WH_sTOCK,
                    NVL(SUM(CASE WHEN WH_sTK>=50 AND TOTAL_OOS=1 THEN 1 END),0)WH_sTOCK_NOTIN_sTORE,
					SUM(TOTAL_OOS)TOTAL_OOS
                    FROM(
                    SELECT FST_SITE LOC,SECTION_CODE,SECTION_NAME,CATEGORY_CODE,CATEGORY_NAMNE,
                    FST_GOLD_CODE,FST_SU,LOC_sTK,WH_sTK,LESS_THAN_OOS, AVG_SALE_OOS, TOTAL_OOS,PO_NO
                    FROM KUWAIT_FASTLINE,grand_prd_master_full B
                    where FST_GOLD_CODE=PRODUCT_CODE
                    AND  FST_SU= SU
                    AND  FST_STATUS='Y'
                    and FST_SITE=:loc
                    )
                    GROUP BY LOC,SECTION_CODE,SECTION_NAME
            """

    cur.execute(sql_query, {'loc': location})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/month-wise-sales-fresh', methods=['GET'])
def monthwisefresh():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
           SELECT * FROM KWT_PPT_FRESH_SALES
            WHERE YYYYMM=:yyyymm
            AND LOC_CODE=:loc
            ORDER BY MM
            """

    cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/stock-in-warehouse-not-in-store', methods=['GET'])
def stockinwarehousenotinstore():
    location = request.args.get("location")  # e.g., "ST01"
    conn = connection()
    cur = conn.cursor()

    sql_query = """
           SELECT DISTINCT SITE_ID LOC,GET_AM_NAME(SITE_ID)AM_NAME,
                            GET_LOC_NAME(SITE_ID),
                            SECTION_CODE,SECTION_NAME,COUNT(*)TOTAL_SKU,
                            NVL(SUM(CASE WHEN WH_STOCK-NVL(DMG_sTOCK,0)>=24 AND BALADIYA_APPROV_YN ='Y' THEN 1 END),0)ACTUAL_sTOCK,
                            NVL(SUM(CASE WHEN WH_STOCK-NVL(DMG_sTOCK,0)>=24 AND BALADIYA_APPROV_YN ='Y' AND NVL(SOH,0) BETWEEN 0 AND 3 THEN 1 END),0)OOS,
                            NVL(SUM(CASE WHEN WH_STOCK-NVL(DMG_sTOCK,0)>=24 AND BALADIYA_APPROV_YN ='Y' AND NVL(SOH,0) NOT BETWEEN 0 AND 3 THEN 1 END),0)AVLBL,
                            NVL(SUM(CASE WHEN WH_STOCK-NVL(DMG_sTOCK,0)>=24 AND BALADIYA_APPROV_YN ='Y' AND SOLD_6MONTH>0 THEN 1 ELSE 0  END),0)TOTAL_sALE_ITEM,
                            NVL(SUM(CASE WHEN WH_STOCK-NVL(DMG_sTOCK,0)>=24 AND BALADIYA_APPROV_YN ='Y' AND SOLD_6MONTH>0 AND NVL(SOH,0) BETWEEN 0 AND 3 THEN 1 ELSE 0  END),0)OOS_sALE_ITEM,
                            NVL(SUM(CASE WHEN WH_STOCK-NVL(DMG_sTOCK,0)>=24 AND BALADIYA_APPROV_YN ='Y' AND SOLD_6MONTH>0 AND NVL(SOH,0) NOT BETWEEN 0 AND 3 THEN 1 ELSE 0  END),0)AVLBL_sALE_ITEM
                            FROM KWT_WH_LOC_SKU A, GRAND_PRD_MASTER_FULL B
                            WHERE PROD_CODE=PRODUCT_CODE
                            AND A.SU=B.SU
                            AND SITE_ID = :loc
                            GROUP BY SITE_ID,SECTION_CODE,SECTION_NAME
            """

    cur.execute(sql_query, {'loc': location})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


def convert_to_date(value):
    # Extract year and month
    year = value // 100
    month = value % 100

    # Return the formatted date as MM-YYYY
    return f"{month:02d}-{year}"


@app.route('/api/gm-customer', methods=['GET'])
def gmcustomer():
    location = request.args.get("location")  # e.g., "ST01"
    yyyymm = request.args.get("yyyymm")
    conn = connection_v6_menu()
    cur = conn.cursor()

    sql_query = """
           SELECT * fROM KWT_BRM_GME_CUST_DETL WHERE GOLD_LOC=:loc order by MONTH asc
            """

    cur.execute(sql_query, {'loc': location})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/week-wise-fresh', methods=['GET'])
def weekwisefresh():
    location = request.args.get("location")  # e.g., "ST01"
    yyyymm = request.args.get("yyyymm")
    conn = connection()
    cur = conn.cursor()

    sql_query = """
         SELECT LOCATION_ID,LOC_NAME,SECTION_CODE,SECTION_NAME,
        DT,MM,
        SALE,PROFIT,
        ROUND((PROFIT/SALE)*100,3)GP,
        DMG_VAL,
        ROUND((DMG_VAL/SALE)*100,3)DMG_PERC
FROM
(SELECT DISTINCT 
        LOCATION_ID,GET_LOC_NAME(LOCATION_ID)LOC_NAME,
        SECTION_CODE,SECTION_NAME,ROUND(SUM(CMO_VALUE),3)SALE,
        ROUND(
        NVL(SUM(CMO_VALUE),0)
        - ( NVL(SUM(OP_VALUE),0) + NVL(SUM(GRN_VALUE),0) + NVL(SUM(TRANS_IN_VALUE),0) )
        + ( NVL(SUM(PR_VALUE),0) + NVL(SUM(TRANS_OUT_VALUE),0) + NVL(SUM(CL_VALUE),0)),2) AS PROFIT,
        ROUND(SUM(PDTDMG_VALUE)+SUM(POSTED_SHRINK_VALUE),3)DMG_VAL,   
        OP_DATE||','||CL_DATE DT,TO_CHAR(CL_DATE,'YYYYMM')MM
                FROM KWT_FRESH_DETAILED_REPORT WHERE  TO_CHAR(CL_DATE,'YYYYMM')= :yyyymm
                AND LOCATION_ID=:loc
           --     AND SECTION_CODE='1S0301'
                GROUP BY 
                LOCATION_ID,SECTION_CODE,SECTION_NAME,OP_DATE,CL_DATE)A
            """

    cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/monthly-lfl', methods=['GET'])
def monthwiselfl():

    def next_same_weekday(base_date, target_weekday):
        days_ahead = (target_weekday - base_date.weekday() + 7) % 7
        return base_date + timedelta(days=days_ahead)

    def shift_month_same_day(date):
        try:
            if date.month == 1:
                return date.replace(year=date.year - 1, month=12, day=min(date.day, 28))
            else:
                return date.replace(month=date.month - 1, day=min(date.day, 28))
        except ValueError as e:

            raise

    def sql_date(d):
        return d.strftime("'%d-%b-%y'").upper()
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    today = datetime.strptime(yyyymm, "%Y%m")
    yesterday = (today + timedelta(days=32)).replace(day=1) - \
        timedelta(days=1)  # last day of month

    current_start = today.replace(day=1)
    current_end = yesterday if yesterday < datetime.today() else datetime.today() - \
        timedelta(days=1)

    start_wd = current_start.weekday()
    end_wd = current_end.weekday()

    # Previous month (weekday aligned)
    last_month_start = next_same_weekday(
        shift_month_same_day(current_start), start_wd)
    last_month_end = next_same_weekday(
        shift_month_same_day(current_end), end_wd)

    # Previous year (weekday aligned)
    last_year_start = next_same_weekday(
        current_start.replace(year=current_start.year - 1), start_wd)
    last_year_end = next_same_weekday(
        current_end.replace(year=current_end.year - 1), end_wd)

    sql_query = f"""
                    SELECT DISTINCT 
                LOC_CODE,
                GET_LOC_NAME(LOC_CODE) AS LOCATION,
                SEC_CODE, 
                SEC_NAME,
                -- This Month
                NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(current_start)} AND {sql_date(current_end)} THEN SOLD_VALUE END),0) AS MTD_VALUE,
                -- Last Month
                NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(last_month_start)} AND {sql_date(last_month_end)} THEN SOLD_VALUE END),0) AS LM_VALUE,
                -- Last Year
                NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(last_year_start)} AND {sql_date(last_year_end)} THEN SOLD_VALUE END),0) AS LY_VALUE,
                -- This Month vs Last Month (%)
                CASE 
                    WHEN NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(last_month_start)} AND {sql_date(last_month_end)} THEN SOLD_VALUE END),0) = 0 
                    THEN NULL
                    ELSE ROUND(
                        (NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(current_start)} AND {sql_date(current_end)} THEN SOLD_VALUE END),0) - 
                        NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(last_month_start)} AND {sql_date(last_month_end)} THEN SOLD_VALUE END),0)
                        ) / 
                        NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(last_month_start)} AND {sql_date(last_month_end)} THEN SOLD_VALUE END),0)
                        * 100, 2
                    )
                END AS TM_VS_LM_PCT,
                
                -- This Month vs Last Year (%)
                CASE 
                    WHEN NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(last_year_start)} AND {sql_date(last_year_end)} THEN SOLD_VALUE END),0) = 0 
                    THEN NULL
                    ELSE ROUND(
                        (NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(current_start)} AND {sql_date(current_end)} THEN SOLD_VALUE END),0) - 
                        NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(last_year_start)} AND {sql_date(last_year_end)} THEN SOLD_VALUE END),0)
                        ) / 
                        NVL(SUM(CASE WHEN DOC_DATE BETWEEN {sql_date(last_year_start)} AND {sql_date(last_year_end)} THEN SOLD_VALUE END),0)
                        * 100, 2
                    )
                END AS TM_VS_LY_PCT

            FROM KWT_DAILY_GP_REPORT R
            JOIN GRAND_PRD_MASTER_FULL A ON GOLD_CODE = PRODUCT_CODE AND GOLD_SU = SU
            JOIN GOLD_HIERARCHY_MASTER B ON A.SUB_CATEG_CODE = B.SUB_CATEG_CODE
            WHERE (DOC_DATE BETWEEN {sql_date(current_start)} AND {sql_date(current_end)}
                OR DOC_DATE BETWEEN {sql_date(last_month_start)} AND {sql_date(last_month_end)}
                OR DOC_DATE BETWEEN {sql_date(last_year_start)} AND {sql_date(last_year_end)})
            AND LOC_CODE = :loc
            GROUP BY LOC_CODE, SEC_CODE, SEC_NAME
            ORDER BY LOC_CODE, SEC_CODE

            """

    cur.execute(sql_query, {'loc': str(location)})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify({"dates": {
        "current": [current_start, current_end],
        "prev_month": [last_month_start, last_month_end],
        "prev_year": [last_year_start, last_year_end]
    }, "data": results})


@app.route('/api/month-wise-customer-comparison', methods=['GET'])
def monthwisecustomercomparison():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
           SELECT distinct to_char(doc_Date,'MM-MONTH')MM,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2025 THEN CUSTOMER_COUNT END),0)CUSTOMER25,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2024 THEN CUSTOMER_COUNT END),0)CUSTOMER24,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2023 THEN CUSTOMER_COUNT END),0)CUSTOMER23,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2022 THEN CUSTOMER_COUNT END),0)CUSTOMER22
            FROM KWT_LIVE_sALE_SUMMARY_dETL
            WHERE LOC_CODE=:loc
            AND TO_CHAR(DOC_dATE,'YYYYMM')<=:yyyymm
            AND DOC_dATE>='01-JAN-21'
            GROUP BY to_char(doc_Date,'MM-MONTH')
            ORDER BY 1
            """

    cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)



@app.route('/api/stock-out-loss', methods=['GET'])
def stockoutloss():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
            SELECT A.*,
            (Select sum(MONTH_SALES) from  KWT_PPT_STOCK_VS_SALES
                    where YYYYMM=a.YYYYMM
                    AND LOC=STORE_ID
                    and SEC_CODE=a.SEC_CODE)TOTAL_sALES,
            (Select sum(MONTH_SALES-MONTH_COST) from  KWT_PPT_STOCK_VS_SALES
                    where YYYYMM=a.YYYYMM
                    AND LOC=STORE_ID
                    and SEC_CODE=a.SEC_CODE)TOTAL_PROFIT
            FROM  KWT_PPT_STOCK_OUT_LOSS_ZEDI A
            WHERE STORE_ID=:loc
            AND YYYYMM=:yyyymm
            ORDER BY SEC_CODE
                        """

    cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/year-wise-gp-comparison', methods=['GET'])
def yearwisegpcomparison():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
       select  TO_CHAR(TO_DATE(DATEMONTH,'YYYYMM'),'MM-MON') MM,
ROUND(SUM(CASE WHEN TO_CHAR(TO_DATE(datemonth,'YYYYMM'),'YYYY') = '2022' THEN (((sale_value-COGS)+TOTAL_DN_VALUE)/sale_value)*100  END),3) AS sale_value22 ,
ROUND(SUM(CASE WHEN TO_CHAR(TO_DATE(datemonth,'YYYYMM'),'YYYY') = '2023' THEN (((sale_value-COGS)+TOTAL_DN_VALUE)/sale_value)*100 END),3) AS sale_value23,
ROUND(SUM(CASE WHEN TO_CHAR(TO_DATE(datemonth,'YYYYMM'),'YYYY') = '2024' THEN (((sale_value-COGS)+TOTAL_DN_VALUE)/sale_value)*100 END),3) AS sale_value24,
ROUND(SUM(CASE WHEN TO_CHAR(TO_DATE(datemonth,'YYYYMM'),'YYYY') = '2025' THEN (((sale_value-COGS)+TOTAL_DN_VALUE)/sale_value)*100 END),3) AS sale_value25
from KWT_BRM_GP_SUMMARY 
where loc_code = :loc
GROUP BY  TO_CHAR(TO_DATE(DATEMONTH,'YYYYMM'),'MM-MON')
ORDER BY 1

            """

    cur.execute(sql_query, {'loc': location})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/year-wise-weekend-sales', methods=['GET'])
def monthwiseweekendsales():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
           SELECT TO_CHAR(DOC_DATE, 'YY-MM-MONTH') AS MM, 
    SUM(CASE 
            WHEN TO_CHAR(DOC_DATE, 'DY', 'NLS_DATE_LANGUAGE=ENGLISH') IN ('THU','FRI','SAT') 
            THEN SALE_VALUE 
            ELSE 0 
        END) AS WEEKDAYS_SALES,
    SUM(CASE 
            WHEN TO_CHAR(DOC_DATE, 'DY', 'NLS_DATE_LANGUAGE=ENGLISH') IN ('THU','FRI','SAT') 
            THEN CUSTOMER_COUNT 
            ELSE 0 
        END) AS WEEKDAYS_CUSTOMERS,
    SUM(CASE 
            WHEN TO_CHAR(DOC_DATE, 'DY', 'NLS_DATE_LANGUAGE=ENGLISH') IN ('SUN','MON','TUE','WED') 
            THEN SALE_VALUE 
            ELSE 0 
        END) AS WEEKENDS_SALES,
    SUM(CASE 
            WHEN TO_CHAR(DOC_DATE, 'DY', 'NLS_DATE_LANGUAGE=ENGLISH') IN ('SUN','MON','TUE','WED') 
            THEN CUSTOMER_COUNT 
            ELSE 0 
        END) AS WEEKENDS_CUSTOMERS
FROM KWT_LIVE_SALE_SUMMARY_DETL
WHERE LOC_CODE = :loc
AND DOC_DATE BETWEEN 
    ADD_MONTHS(TO_DATE(:yyyymm || '01', 'YYYYMMDD'), -11)
    AND LAST_DAY(TO_DATE(:yyyymm || '01', 'YYYYMMDD'))
--AND DOC_DATE >= TRUNC(SYSDATE, 'YEAR')
GROUP BY TO_CHAR(DOC_DATE, 'YY-MM-MONTH')
ORDER BY TO_CHAR(DOC_DATE, 'YY-MM-MONTH')
            """

    cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/month-wise-basket-value-comparison', methods=['GET'])
def monthwisebasketvaluecomparison():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()

    sql_query = """
           SELECT MM, ROUND(SALES25/CUSTOMER25,3) BK_2025 ,ROUND(SALES24/CUSTOMER24,3) BK_2024,  ROUND(SALES23/CUSTOMER23,3)BK_2023,  ROUND(SALES22/CUSTOMER22,3)BK_2022  , CUSTOMER22 ,CUSTOMER23 ,CUSTOMER24,CUSTOMER25 , SALES22,SALES23,SALES24,SALES25
           FROM (
            SELECT distinct to_char(doc_Date,'MM-MONTH')MM,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2025 THEN CUSTOMER_COUNT END),0)CUSTOMER25,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2024 THEN CUSTOMER_COUNT END),0)CUSTOMER24,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2023 THEN CUSTOMER_COUNT END),0)CUSTOMER23,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2022 THEN CUSTOMER_COUNT END),0)CUSTOMER22,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2025 THEN SALE_vALUE END),0)SALES25,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2024 THEN SALE_vALUE END),0)SALES24,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2023 THEN SALE_vALUE END),0)SALES23,
            ROUND(SUM(CASE WHEN TO_CHAR(DOC_dATE,'YYYY')=2022 THEN SALE_vALUE END),0)SALES22
            FROM KWT_LIVE_sALE_SUMMARY_dETL
            WHERE LOC_CODE=:loc
            AND TO_CHAR(DOC_dATE,'YYYYMM')<=:yyyymm
            AND DOC_dATE>='01-JAN-21'
            GROUP BY to_char(doc_Date,'MM-MONTH'))
            ORDER BY 1
            """

    cur.execute(sql_query, {'loc': location, 'yyyymm': yyyymm})
    columns = [col[0] for col in cur.description]

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)



@app.route('/api/locations', methods=["GET"])
def getlocations():
    user_id = request.args.get('userId')
    print(user_id)
    conn = connection()
    cur = conn.cursor()

    sql_query = """
       SELECT DISTINCT k.LOCATION_ID,GET_LOC_NAME(LOCATION_ID) LOCATION_NAME 
        FROM KPI_SITE k
        WHERE k.LEVEL_2 = '4-KUWAIT' AND K.LOCATION_ID NOT IN (460, 2009 ,5601 ,5602,5603,5604)
        AND k.LOCATION_ID IN (
            SELECT a.US_SITE
            FROM IVISION_USER_SITE a
            WHERE a.US_USER IN (:user_id)
        )
        ORDER BY k.LOCATION_ID ASC

    """

    cur.execute(sql_query, {'user_id': user_id})
    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/api/year-date-periods', methods=["GET"])
def yeardateperiods():
    conn = connection()
    cur = conn.cursor()

    sql_query = """
      select distinct YYYYMM from KWT_PPT_STOCK_VS_SALES order by yyyymm 
    """

    cur.execute(sql_query)

    columns = [col[0] for col in cur.description]

    results = []
    for row in cur.fetchall():
        row_dict = dict(zip(columns, row))
        results.append(row_dict)

    cur.close()
    conn.close()

    return jsonify(results)


@app.route('/improvement_plans/<yyyymm>', methods=['GET'])
def get_improvement_plans_by_yyyymm(yyyymm):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT ID, USER_ID, USER_NAME, SALES_AREA_ID, SUGGESTION, CREATED_AT, YYYYMM
        FROM SALES_IMPROVEMENT_PLANS
        WHERE YYYYMM = :1
        ORDER BY ID
    """, (yyyymm,))

    rows = cursor.fetchall()
    plans = []
    for row in rows:
        # Convert LOB to string
        suggestion = row[4].read() if hasattr(row[4], 'read') else str(row[4])
        plans.append({
            "id": row[0],
            "user_id": row[1],
            "user_name": row[2],
            "sales_area_id": row[3],
            "suggestion": suggestion,
            "created_at": row[5].strftime("%Y-%m-%d %H:%M:%S") if row[5] else None,
            "yyyymm": row[6]
        })
    cursor.close()
    conn.close()
    return jsonify(plans)


# Get all areas
@app.route('/sales_area', methods=['GET'])
def get_sales_areas():
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT AREA_ID, AREA_NAME, ADDED_BY FROM SALES_AREA ORDER BY AREA_ID")
    rows = cursor.fetchall()
    areas = []
    for row in rows:
        areas.append(
            {"area_id": row[0], "area_name": row[1], "added_by": row[2]})
    return jsonify(areas)

# Create a new area


@app.route('/sales_area', methods=['POST'])
def create_sales_area():
    data = request.get_json()
    area_name = data.get('area_name')
    added_by = data.get('added_by')

    conn = connection()
    cursor = conn.cursor()

    try:
        # Variable to hold the new ID
        new_id = cursor.var(int)

        cursor.execute(
            """
            INSERT INTO SALES_AREA (AREA_NAME, ADDED_BY)
            VALUES (:1, :2)
            RETURNING AREA_ID INTO :3
            """,
            (area_name, added_by, new_id)
        )

        conn.commit()

        return jsonify({
            "message": "Sales area created successfully",
            "id": new_id.getvalue()
        }), 201

    except oracledb.IntegrityError as e:
        error_obj, = e.args

        # ORA-00001 -> unique constraint violated
        if "ORA-00001" in error_obj.message:
            return jsonify({
                "error": "Duplicate entry",
                "message": "This sales area already exists."
            }), 400

        return jsonify({
            "error": "Integrity error",
            "message": error_obj.message
        }), 400

    except Exception as e:
        return jsonify({
            "error": "Server error",
            "message": str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()

# Delete an area by ID


@app.route('/sales_area/<int:area_id>', methods=['DELETE'])
def delete_sales_area(area_id):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM SALES_AREA WHERE AREA_ID = :1", (area_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": f"Sales area {area_id} deleted successfully"})

# ------------------------------
# SALES_IMPROVEMENT_PLANS Endpoints
# ------------------------------


@app.route('/improvement_plans', methods=['GET'])
def get_improvement_plans():
    conn = connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT ID, USER_ID, USER_NAME, SALES_AREA_ID, SUGGESTION, CREATED_AT, LOC_CODE, YYYYMM
        FROM SALES_IMPROVEMENT_PLANS
        ORDER BY ID
    """)

    rows = cursor.fetchall()
    plans = []
    for row in rows:
        # If SUGGESTION is a LOB, read it
        suggestion_text = row[4]
        if isinstance(suggestion_text, oracledb.LOB):
            suggestion_text = suggestion_text.read()

        plans.append({
            "id": row[0],
            "user_id": row[1],
            "user_name": row[2],
            "sales_area_id": row[3],
            "suggestion": suggestion_text,
            "created_at": row[5].strftime("%Y-%m-%d %H:%M:%S") if row[5] else None,
            "loc_code": row[6],
            "yyyymm": row[7],
        })

    cursor.close()
    conn.close()

    return jsonify(plans)

# Create a new improvement plan


@app.route('/improvement_plans', methods=['POST'])
def create_improvement_plan():
    data = request.get_json()
    print("Received data:", data)
    print(type(data.get("user_id")))
    print(type(data.get("user_name")))
    print(type(data.get("sales_area_id")))
    print(type(data.get("suggestion")))
    print(type(data.get("loc_code")))
    print(type(data.get("yyyymm")))

    user_id = data.get('user_id')
    user_name = data.get('user_name')
    sales_area_id = data.get('sales_area_id')
    suggestion = data.get('suggestion')
    loc_code = data.get('loc_code')
    yyyymm = data.get('yyyymm')
    conn = connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO SALES_IMPROVEMENT_PLANS (USER_ID, USER_NAME, SALES_AREA_ID, SUGGESTION ,yyyymm ,loc_code)
        VALUES (:1, :2, :3, :4 , :5, :6)
    """, (user_id, user_name, sales_area_id, suggestion, yyyymm, loc_code))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Improvement plan created successfully"}), 201


# Delete an improvement plan by ID
@app.route('/improvement_plans/<int:plan_id>', methods=['DELETE'])
def delete_improvement_plan(plan_id):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM SALES_IMPROVEMENT_PLANS WHERE ID = :1", (plan_id,))
    conn.commit()
    return jsonify({"message": f"Improvement plan {plan_id} deleted successfully"})


def simple_decrypt(enc_text, key=23):
    # 1. Base64 Decode
    decoded = base64.b64decode(enc_text).decode("utf-8")

    # 2. XOR back to original characters
    original = ''.join(chr(ord(c) ^ key) for c in decoded)
    return original


@app.route("/api/decode-token", methods=['GET'])
def decode():
    try:
        conn = connection()
        cursor = conn.cursor()
        token = request.args.get("token")
        print(token)

        dec = simple_decrypt(token)

        try:
            sql = """
                SELECT 
                    USR_ID,
                    UPPER(USR_PWD), 
                    USR_NAME, 
                    USR_PROFILE
                FROM IVISION_USER 
                WHERE USR_ID = :1 AND NVL(USR_ACTIVE, 'Y') <> 'N'
            """
            cursor.execute(sql, [dec.upper()])
            row = cursor.fetchone()
        finally:
            conn.close()

        if not row:
            return {
                "status": "fail",
                "error": "Username not found or inactive"
            }

        user_id, user_password, user_name, role = row

        print(user_id, user_password, user_name, role)

    except Exception as e:
        return jsonify({"error": "Invalid token"})

    return jsonify({"username": user_name.lower(), "id": user_id})


def simple_encrypt(plain_text, key=23):

    xor_text = ''.join(chr(ord(c) ^ key) for c in plain_text)

    encoded = base64.b64encode(xor_text.encode("utf-8")).decode("utf-8")
    return encoded


def reverse_two_digits(val):
    return int(val[::-1])


@app.route("/api/generatetoken", methods=['GET'])
def encrypt():
    code_with_time = request.args.get("code")

    if not code_with_time or len(code_with_time) < 4:
        return jsonify({"error": "Invalid input length"}), 400

    # Extract
    minutes_rev = code_with_time[0:2]
    hours_rev = code_with_time[2:4]
    user_code = code_with_time[4:] if len(code_with_time) > 4 else ""

    try:
        minutes = reverse_two_digits(minutes_rev)
        hours = reverse_two_digits(hours_rev)
    except:
        return jsonify({"error": "Invalid numeric format"}), 400

    # Current server time
    now = datetime.now()
    current_hour = now.hour
    current_minute = now.minute

    # Check time
    time_valid = (minutes == current_minute and hours == current_hour)

    if not time_valid:
        return jsonify({
            "error": "Invalid code try again",
            "decoded_time": f"{hours:02}:{minutes:02}",
            "server_time": f"{current_hour:02}:{current_minute:02}"
        }), 400

    # If time correct → return ONLY the code
    return jsonify({
        "code": simple_encrypt(user_code)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
