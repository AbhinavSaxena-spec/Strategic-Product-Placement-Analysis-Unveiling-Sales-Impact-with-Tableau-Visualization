"""
Strategic Product Placement Analysis — Flask Backend
=====================================================
Dataset columns (matches Book1.twb exactly):
  Product ID, Product Position, Price, Competitor's Price,
  Promotion, Foot Traffic, Consumer Demographics,
  Product Category, Seasonal, Sales Volume
"""

from flask import Flask, jsonify, request, send_file
import pandas as pd
import os
import io

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, 'Product Positioning.csv')

def load_data():
    return pd.read_csv(CSV_PATH)

def apply_filters(df):
    position     = request.args.get('position')
    category     = request.args.get('category')
    promotion    = request.args.get('promotion')
    foot_traffic = request.args.get('foot_traffic')
    demographics = request.args.get('demographics')
    seasonal     = request.args.get('seasonal')
    if position:     df = df[df['Product Position'] == position]
    if category:     df = df[df['Product Category'] == category]
    if promotion:    df = df[df['Promotion'] == promotion]
    if foot_traffic: df = df[df['Foot Traffic'] == foot_traffic]
    if demographics: df = df[df['Consumer Demographics'] == demographics]
    if seasonal:     df = df[df['Seasonal'] == seasonal]
    return df

@app.after_request
def add_cors(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    r.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return r

@app.route('/')
def index():
    df = load_data()
    return f'''<html><head><title>PlacementIQ API</title>
    <style>body{{font-family:monospace;background:#0a0d14;color:#e2e8f0;padding:40px;line-height:2.2}}
    h1{{color:#00d4ff}}a{{color:#00d4ff;text-decoration:none}}a:hover{{text-decoration:underline}}
    .tag{{background:#1e2a42;color:#94a3b8;padding:2px 8px;border-radius:4px;font-size:11px;margin-left:8px}}
    .ok{{color:#22c55e}}hr{{border-color:#1e2a42;margin:20px 0}}</style></head>
    <body><h1>📊 PlacementIQ — Product Placement Analysis API</h1>
    <span class="ok">✅ {len(df)} records loaded</span><hr>
    <a href="/api/kpis">/api/kpis</a><span class="tag">GET</span> — KPI Summary<br>
    <a href="/api/data">/api/data</a><span class="tag">GET</span> — Full Dataset<br>
    <a href="/api/positions">/api/positions</a><span class="tag">GET</span> — Sales by Position<br>
    <a href="/api/categories">/api/categories</a><span class="tag">GET</span> — Sales by Category<br>
    <a href="/api/promotions">/api/promotions</a><span class="tag">GET</span> — Promotion Impact<br>
    <a href="/api/foot-traffic">/api/foot-traffic</a><span class="tag">GET</span> — Foot Traffic vs Sales<br>
    <a href="/api/demographics">/api/demographics</a><span class="tag">GET</span> — Consumer Demographics<br>
    <a href="/api/pricing">/api/pricing</a><span class="tag">GET</span> — Price vs Competitor<br>
    <a href="/api/seasonal">/api/seasonal</a><span class="tag">GET</span> — Seasonal Analysis<br>
    <a href="/api/recommendations">/api/recommendations</a><span class="tag">GET</span> — Recommendations<br>
    <a href="/api/export">/api/export</a><span class="tag">GET</span> — Download CSV<br>
    <hr><span style="color:#64748b;font-size:12px">
    Filters: ?position=Eye Level | ?category=Electronics | ?promotion=Yes | ?foot_traffic=High | ?demographics=Students | ?seasonal=Yes
    </span></body></html>'''

@app.route('/api/kpis')
def kpis():
    df = apply_filters(load_data())
    if df.empty:
        return jsonify({'error': 'No data found for these filters'}), 404
    promo_yes = df[df['Promotion']=='Yes']['Sales Volume'].mean()
    promo_no  = df[df['Promotion']=='No']['Sales Volume'].mean()
    return jsonify({
        'total_sales_volume':    int(df['Sales Volume'].sum()),
        'avg_sales_per_product': round(float(df['Sales Volume'].mean()), 1),
        'avg_price':             round(float(df['Price'].mean()), 2),
        'avg_competitor_price':  round(float(df["Competitor's Price"].mean()), 2),
        'price_vs_competitor':   round(float(df['Price'].mean() - df["Competitor's Price"].mean()), 2),
        'promotion_lift_pct':    round((promo_yes/promo_no - 1)*100, 1) if promo_no else 0,
        'top_position':          df.groupby('Product Position')['Sales Volume'].sum().idxmax(),
        'top_category':          df.groupby('Product Category')['Sales Volume'].sum().idxmax(),
        'total_products':        int(df['Product ID'].nunique()),
        'total_records':         len(df),
    })

@app.route('/api/data')
def data():
    df = apply_filters(load_data())
    page, per_page = int(request.args.get('page',1)), int(request.args.get('per_page',20))
    total = len(df)
    chunk = df.iloc[(page-1)*per_page : page*per_page]
    return jsonify({'page':page,'per_page':per_page,'total':total,
                    'pages':(total+per_page-1)//per_page,'data':chunk.to_dict(orient='records')})

@app.route('/api/positions')
def positions():
    df = apply_filters(load_data())
    g = df.groupby('Product Position').agg(
        total_sales=('Sales Volume','sum'), avg_sales=('Sales Volume','mean'),
        avg_price=('Price','mean'), product_count=('Product ID','count')
    ).reset_index().round(2).sort_values('total_sales', ascending=False)
    return jsonify({'positions':g.to_dict(orient='records'),
                    'best_position':g.iloc[0]['Product Position'],
                    'worst_position':g.iloc[-1]['Product Position']})

@app.route('/api/categories')
def categories():
    df = apply_filters(load_data())
    g = df.groupby('Product Category').agg(
        total_sales=('Sales Volume','sum'), avg_sales=('Sales Volume','mean'),
        avg_price=('Price','mean'), product_count=('Product ID','count')
    ).reset_index().round(2).sort_values('total_sales', ascending=False)
    return jsonify({'categories': g.to_dict(orient='records')})

@app.route('/api/promotions')
def promotions():
    df = apply_filters(load_data())
    g = df.groupby('Promotion').agg(
        total_sales=('Sales Volume','sum'), avg_sales=('Sales Volume','mean'),
        product_count=('Product ID','count')
    ).reset_index().round(2)
    combo = df.groupby(['Product Position','Promotion']).agg(
        avg_sales=('Sales Volume','mean')).reset_index().round(2)
    return jsonify({'promotion_summary':g.to_dict(orient='records'),
                    'position_x_promotion':combo.to_dict(orient='records')})

@app.route('/api/foot-traffic')
def foot_traffic():
    df = apply_filters(load_data())
    g = df.groupby('Foot Traffic').agg(
        total_sales=('Sales Volume','sum'), avg_sales=('Sales Volume','mean'),
        product_count=('Product ID','count')
    ).reset_index().round(2)
    order = {'Low':0,'Medium':1,'High':2}
    g['_o'] = g['Foot Traffic'].map(order)
    g = g.sort_values('_o').drop(columns='_o')
    return jsonify({'foot_traffic': g.to_dict(orient='records')})

@app.route('/api/demographics')
def demographics():
    df = apply_filters(load_data())
    g = df.groupby('Consumer Demographics').agg(
        total_sales=('Sales Volume','sum'), avg_sales=('Sales Volume','mean'),
        avg_price=('Price','mean'), product_count=('Product ID','count')
    ).reset_index().round(2).sort_values('total_sales', ascending=False)
    return jsonify({'demographics': g.to_dict(orient='records')})

@app.route('/api/pricing')
def pricing():
    df = apply_filters(load_data()).copy()
    df['price_position'] = df.apply(
        lambda r: 'Cheaper than Competitor' if r['Price'] < r["Competitor's Price"]
        else ('Same as Competitor' if abs(r['Price']-r["Competitor's Price"])<5
              else 'Pricier than Competitor'), axis=1)
    g = df.groupby('price_position').agg(
        total_sales=('Sales Volume','sum'), avg_sales=('Sales Volume','mean'),
        product_count=('Product ID','count')).reset_index().round(2)
    cat = df.groupby('Product Category').agg(
        avg_price=('Price','mean'), avg_comp_price=("Competitor's Price",'mean'),
        avg_sales=('Sales Volume','mean')).reset_index().round(2)
    return jsonify({'price_competitiveness':g.to_dict(orient='records'),
                    'category_pricing':cat.to_dict(orient='records'),
                    'overall_avg_price':round(float(df['Price'].mean()),2),
                    'overall_avg_comp_price':round(float(df["Competitor's Price"].mean()),2)})

@app.route('/api/seasonal')
def seasonal():
    df = apply_filters(load_data())
    g = df.groupby('Seasonal').agg(
        total_sales=('Sales Volume','sum'), avg_sales=('Sales Volume','mean'),
        product_count=('Product ID','count')).reset_index().round(2)
    combo = df.groupby(['Seasonal','Product Position']).agg(
        avg_sales=('Sales Volume','mean')).reset_index().round(2)
    return jsonify({'seasonal_summary':g.to_dict(orient='records'),
                    'seasonal_x_position':combo.to_dict(orient='records')})

@app.route('/api/recommendations')
def recommendations():
    df = load_data()
    pos_sales  = df.groupby('Product Position')['Sales Volume'].mean()
    best_pos   = pos_sales.idxmax()
    worst_pos  = pos_sales.idxmin()
    promo_yes  = df[df['Promotion']=='Yes']['Sales Volume'].mean()
    promo_no   = df[df['Promotion']=='No']['Sales Volume'].mean()
    promo_lift = round((promo_yes/promo_no-1)*100,1) if promo_no else 0
    best_demo  = df.groupby('Consumer Demographics')['Sales Volume'].mean().idxmax()
    best_cat   = df.groupby('Product Category')['Sales Volume'].mean().idxmax()
    hi_traffic = df[df['Foot Traffic']=='High']['Sales Volume'].mean()
    lo_traffic = df[df['Foot Traffic']=='Low']['Sales Volume'].mean()
    t_lift     = round((hi_traffic/lo_traffic-1)*100,1) if lo_traffic else 0
    return jsonify({'recommendations':[
        {'priority':'Critical','title':f'Move more products to {best_pos}',
         'detail':f'{best_pos} is your best-performing placement. Shift products away from {worst_pos} to {best_pos} for immediate sales boost.','impact':'High','effort':'Low'},
        {'priority':'Critical','title':f'Promotions lift sales by {promo_lift}%',
         'detail':f'Promotional products sell {promo_lift}% more. Build a structured promo calendar focused on top positions.','impact':'High','effort':'Medium'},
        {'priority':'High','title':f'Target {best_demo} demographic',
         'detail':f'{best_demo} customers show the highest purchase volume. Tailor messaging and pricing to this segment.','impact':'Medium','effort':'Medium'},
        {'priority':'High','title':f'Place {best_cat} at high foot traffic zones',
         'detail':f'{best_cat} is your top category. High traffic zones yield {t_lift}% more sales — combine both for maximum revenue.','impact':'High','effort':'Low'},
        {'priority':'Medium','title':'Audit pricing vs competitors',
         'detail':'Categories priced above competitors without justification lose sales. Review and adjust where gap exceeds 15%.','impact':'Medium','effort':'Medium'},
        {'priority':'Medium','title':'Build a seasonal placement plan',
         'detail':'Seasonal products need prime spots during peak months. Rotate them out to lower shelves off-season.','impact':'Medium','effort':'Low'},
    ]})

@app.route('/api/export')
def export():
    df = apply_filters(load_data())
    if df.empty:
        return jsonify({'error': 'No data to export'}), 404
    out = io.StringIO()
    df.to_csv(out, index=False)
    out.seek(0)
    return send_file(io.BytesIO(out.getvalue().encode()), mimetype='text/csv',
                     as_attachment=True, download_name='product_positioning_filtered.csv')

if __name__ == '__main__':
    print("\n" + "="*50)
    print("  📊 PlacementIQ Flask API — Starting...")
    print("="*50)
    if not os.path.exists(CSV_PATH):
        print(f"\n  ❌ ERROR: 'Product Positioning.csv' not found")
        print(f"     Put the CSV in the same folder as app.py\n")
    else:
        df = load_data()
        print(f"\n  ✅ Dataset loaded — {len(df)} records")
        print(f"  🌐 Open: http://127.0.0.1:5000")
        print(f"  Press CTRL+C to stop\n")
        app.run(debug=True, port=5000)
