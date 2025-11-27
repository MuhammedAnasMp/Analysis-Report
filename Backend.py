from flask import Flask, jsonify
import oracledb
from flask_cors import CORS
from flask import Flask, request, jsonify
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

def connection():
    username = "KHYPER"
    password = "KHYPER"
    dsn = "192.168.2.171:1521/ZEDEYE"
    client_path = r"C:\instantclient_19_5"  

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

@app.route("/api/target-vs-achievement",methods=['GET' ,'POST'])
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
                NVL(TOTAL_BUDGET,0) - NVL(TILL_SALES,0) AS DIFFERENCE,
                CASE 
                    WHEN NVL(TILL_SALES,0) = 0 THEN 0
                    ELSE ROUND((NVL(TOTAL_BUDGET,0) - NVL(TILL_SALES,0)) / NVL(TILL_SALES,0) * 100, 2)
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

        

import time
@app.route('/api/stockvsageing', methods=['GET'])
def stockvsageing():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()
    
    sql_query = """
            SELECT SEC_CODE,SEC_NAME,SKU_COUNT,STOCK_QTY, VALUE, AGE_180, AGE_365, AGE_ABOVE730, MONTH_SALES, MONTH_SALES-MONTH_COST PROFIT,
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




@app.route('/api/month-wise-basket-value-comparison', methods=['GET'])
def monthwisebasketvaluecomparison():
    yyyymm = request.args.get("yyyymm")        # e.g., "202510"
    location = request.args.get("location")  # e.g., "ST01"

    conn = connection()
    cur = conn.cursor()
    
    sql_query = """
           SELECT MM, ROUND(SALES25/CUSTOMER25,3) BK_2025 ,ROUND(SALES24/CUSTOMER24,3) BK_2024,  ROUND(SALES23/CUSTOMER23,3)BK_2023,  ROUND(SALES22/CUSTOMER22,3)BK_2022 FROM (
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
    conn = connection()
    cur = conn.cursor()

    sql_query = """
       SELECT DISTINCT LOCATION_ID,LOCATION_NAME FROM KPI_SITE WHERE LEVEL_2='4-KUWAIT' order by location_id asc
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





if __name__ == "__main__":
    app.run(debug=True)