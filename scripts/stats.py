'''
   Blaine Booher, 11.07.2015 for the Hack Fargo Visualization Hackathon

   Load up the Great Rides Bike Share csv file, pre-compute some stuff, save as .json file

   No external dependencies (I think json and csv are included in python standard library)
   The resulting json file (computed.array.json) has stats for each day in the data set,
   padded to the first Monday and last Sunday, including empty sets for days that have no data.

   We compute number of checkins and checkouts per hour, including an itemized count for each
   station.

   Station names are hard coded for convenience, but they could easily be pulled from the
   csv file before computation. There's several little things like that that I'd like to
   refine over time.

   No options -- just run this file straight up: $ python stats.py
'''

import csv
import datetime
import json
from collections import defaultdict

trips = defaultdict(dict)
memberships = defaultdict(int)
stations_in = defaultdict(int)
stations_out = defaultdict(int)
bikes = defaultdict(int)
#['Student', '2376', 'University Village', 'Wallman Wellness Center', '2015-06-11', '2015-06-11', '12:46:54', '12:55:33']

# hard coded, for now, ordered North -> South
stations = ['University Village', 'High Rise Complex', 'Wallman Wellness Center', 'Memorial Union',
'Sanford Medical Center', 'Great Northern Bicycle Co.',
'Barry Hall', 'US Bank Plaza',  'Renaissance Hall',  'MATBUS Center Downtown',  'Fercho YMCA']

def fillMissingDates(trips):
    '''
        Make sure all dates are represented, and date ranges start on Monday and end on Sunday
    '''
    # make sure that all dates are present
    date1 = map(int, sorted(trips.keys())[0].split('-'))
    date2 = map(int, sorted(trips.keys())[-1].split('-'))

    # map to datetime object
    date1 = datetime.date(date1[0], date1[1], date1[2])
    date2 = datetime.date(date2[0], date2[1], date2[2])

    # Walk backwards from date1 to make sure we start on a Monday
    while (date1.weekday() > 0):
        date1 = date1 - datetime.timedelta(days=1)

    # walk forwards from date2 to make sure we end on a Sunday
    while (date2.weekday() < 6):
        date2 = date2 + datetime.timedelta(days=1)

    # fill in any missing dates so all dates are represented
    t = date1
    while (t <= date2):
        key = t.strftime('%Y-%m-%d')
        if (not trips.has_key(t.strftime('%Y-%m-%d'))):
            initDict(key, trips)
        t = t + datetime.timedelta(days=1)
    return trips

def initDict(key, trips):
    '''
        Initialize the overall data set, including default values and zero sets
    '''
    # throw it in the list by checkout
    if (not trips.has_key(key)):
        # 24 0s, because that's how many hours are between 6am and 12pm
        trips[key] = {
            'date': key,
            'checkins_sum': 0, 'checkouts_sum': 0,
            'totals_out': [0]*24, 'totals_in': [0]*24,
            # have to get tricky with xrange so that we dont accidentally copy the same instance 11 times
            'stations_in': [[0]*24 for _ in xrange(len(stations))], 'stations_out': [[0]*24 for _ in xrange(len(stations))],
            'stacked_in': [[0]*len(stations) for _ in xrange(24)], 'stacked_out': [[0]*len(stations) for _ in xrange(24)]
        }

# Open up the csv file and parse the sucker
with open('season-data-2015.csv') as csvfile:
    reader = csv.reader(csvfile)
    k = 0
    for row in reader:
        k += 1

        # skip the header
        if not k > 1:
            continue

        row[2] = row[2].strip()
        row[3] = row[3].strip()

        # Fix the data
        skip = ('shop', 'fargo brewing co', 'the stage at island park')
        if (row[2].lower() in skip or row[3].lower() in skip):
            continue
        if ('expansion' in row[2].lower()):
            row[2] = row[2][len('expansion: '):]
        if ('expansion' in row[3].lower()):
            row[3] = row[3][len('expansion: '):]
        if ('memorial union station' in row[2].lower()):
            row[2] = 'Memorial Union'
        if ('memorial union station' in row[3].lower()):
            row[3] = 'Memorial Union'

        # Some simple stats that don't make it to the final json file, but we could use in the future
        memberships[row[0]] += 1
        stations_in[row[2]] += 1
        stations_out[row[3]] += 1
        bikes[row[1]] += 1

        # initialize both dates -- the checkin and the checkout date
        initDict(row[4], trips)
        initDict(row[5], trips)

        # tally up the total checkins and checkouts
        trips[row[4]]['checkouts_sum'] += 1
        trips[row[5]]['checkins_sum'] += 1

        # tally up checkouts by hour
        index_out = int(row[6].split(':')[0])
        trips[row[4]]['totals_out'][index_out] += 1

        # tally up checkins by hour
        index_in = int(row[7].split(':')[0])
        trips[row[5]]['totals_in'][index_in] += 1

        # tally up checkouts and checkins by station, by hour
        # this isn't currently used, but would be very useful for displaying
        # an aggregate graph broken up by station (1 graph per station)
        trips[row[4]]['stations_out'][stations.index(row[2])][index_out] += 1
        trips[row[5]]['stations_in'][stations.index(row[3])][index_in] += 1

        # tally up checkouts and checkins by hour, by station
        trips[row[4]]['stacked_out'][index_out][stations.index(row[2])] += 1
        trips[row[5]]['stacked_in'][index_in][stations.index(row[3])] += 1


trips = fillMissingDates(trips)
print 'read %d values into memory' % len(trips)

# print a summary
for o in sorted(stations_in.keys()):
    print '%s: %s %s   %d' % (o.ljust(30), str(stations_in[o]).rjust(8), str(stations_out[o]).rjust(8), stations_in[o] - stations_out[o])

for o in sorted(bikes.keys()):
    print o, bikes[o]

# dump as a json object (not currently used)
#t = json.dumps(trips, sort_keys=True)
#open('computed.dict.json', 'w').write(t)
#print 'wrote computed.dict.json'

# dump as a flat, json array sorted by ascending date
l = [trips[o] for o in sorted(trips.keys())]
open('computed.array.json', 'w').write(json.dumps(l, sort_keys=True))
print 'wrote computed.array.json'
