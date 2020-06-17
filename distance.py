import requests
import json
import numpy as np
import pandas as pd
import math

URL = "https://transportapi.com/v3/uk/public/journey/from/lonlat:-0.133924,51.528135/to/lonlat:-0.088780,51.506383.json?app_id=d9d3eca0&app_key=cfd4e8f645741a3d30ac1c0d776458c6&modes=bus&service=southeast"
"""
URL = "https://transportapi.com/v3/uk/public/journey/from/"
to = "/to/"
last = ".json?app_id=d9d3eca0&app_key=cfd4e8f645741a3d30ac1c0d776458c6&modes=bus&service=tfl"
locA = input("Start position :")
locB = input("Destination :")
"""
location = "-0.133924,51.528135" #[array of long and lat] from the front end
location2 = "-0.088780,51.506383" #[array of long and lat] from the front end

PARAMS = {}
PARAMS2 = {'query':location2}


#Urlfinal = URL + location + to + location2 + last
#print (Urlfinal)

def distair(locA, locB): #Working out the distance by air
    R = 6373.0

    df = pd.read_excel(r'/Users/고준호/Documents/Projects/myapp/country list.xlsx')
    #print(df)


    lat1 = df.loc[3,'latitude']
    lon1 = df.loc[3,'longitude']
    lat2 = df.loc[5,'latitude']
    lon2 = df.loc[5,'longitude']

    dlon = lon2 - lon1

    dlat = lat2 - lat1

    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance

req = requests.get(url=URL, params=PARAMS)
data = req.json()
#dat = data['routes'][0]['route_parts'][0]['coordinates'][0]
#print ("%s"
#        %(dat))

def disttrain(locA, locB):
    R = 6373.0
    distance = []
    routeslen = len(data['routes'])

    d = 0.0

    for i in range(routeslen):
        for j in range(len(data['routes'][i]['route_parts'])-1):
            lenk = len(data['routes'][i]['route_parts'][j]['coordinates'])-1
            for k in range(len(data['routes'][i]['route_parts'][j]['coordinates'])):
                if k == lenk:
                    distance.append(d)
                else:
                    lat1 = float(data['routes'][i]['route_parts'][j]['coordinates'][k][1])
                    lon1 = float(data['routes'][i]['route_parts'][j]['coordinates'][k][0])
                    lat2 = float(data['routes'][i]['route_parts'][j]['coordinates'][k+1][1])
                    lon2 = float(data['routes'][i]['route_parts'][j]['coordinates'][k+1][0])

                    dlon = lon2 - lon1

                    dlat = lat2 - lat1

                    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2

                    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                    dis = R * c
                    d = d + dis

    return distance