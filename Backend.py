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

@app.route("/")
def hello_world():
    conn = connection()
    cur = conn.cursor()
    
    sql_query = """
            SELECT SEC_CODE,SEC_NAME,TOTAL_BUDGET,BUD_AVG,TILL_SALES, TILL_SALES/31 AVG_SALE,REMARK ,LOC_CODE,YYYYMM,
            NVL(TOTAL_BUDGET,0) - NVL(TILL_SALES,0) DIFFERENCE,
            ROUND((NVL(TOTAL_BUDGET,0) - NVL(TILL_SALES,0))/NVL(TILL_SALES,0)*100,2) DIF_PERC
            FROM KWT_PPT_SALES_BUDGET A
            WHERE LOC_CODE = :loc
            AND YYYYMM = :yyyymm
            ORDER BY SEC_CODE
            """

    cur.execute(sql_query, {'loc': 802, 'yyyymm': 202510})
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
@app.route('/api/budget', methods=['POST',"GET"])
def update_remark():
    print(">>>>>>>>>")
    data = request.get_json()
    print(data)
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



if __name__ == "__main__":
    app.run(debug=True)