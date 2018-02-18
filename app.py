
# import necessary libraries
import pandas as pd

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import inspect

from flask import (
    Flask,
    render_template,
    jsonify)

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///DataSets/belly_button_biodiversity.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the table
#Bigfoot = Base.classes.bigfoot
inspector = inspect(engine)

# Save references to the stations and measurements tables
samples_metadata = Base.classes.samples_metadata

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# Query the database and send the jsonified results
@app.route("/data")
def data():
    sel = [func.strftime("%Y", Bigfoot.timestamp), func.count(Bigfoot.timestamp)]
    results = session.query(*sel).\
        group_by(func.strftime("%Y", Bigfoot.timestamp)).all()
    df = pd.DataFrame(results, columns=['months', 'sightings'])
    return jsonify(df.to_dict(orient="records"))

@app.route("/names")
def names():
    samples_columns = inspector.get_columns('samples')
    names_list = []
    for x in samples_columns:
        if x["name"].startswith("BB"):
            names_list.append(x["name"])

    return jsonify(names_list)

@app.route('/metadata/<sample>')
def metadata(sample):


    results = session.query(samples_metadata.AGE, samples_metadata.BBTYPE, 
                            samples_metadata.ETHNICITY,samples_metadata.GENDER,
                            samples_metadata.LOCATION, samples_metadata.SAMPLEID).\
             filter(samples_metadata.SAMPLEID == sample[3:]).all()

    df = pd.DataFrame(results, columns=['AGE', 'BBTYPE','ETHNICITY','GENDER','LOCATION','SAMPLEID'])


    return jsonify(df.to_dict(orient="records"))

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    # WARNING! Don't use debug in heroku!
    app.run(debug=True)
    # app.run()