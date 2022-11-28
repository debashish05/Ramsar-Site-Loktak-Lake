# Will fetch temperature of manipur from the website https://tcktcktck.org/manipur/january-2010
# It have data from Jan 2010 to Dec 2020.
# Reference: https://www.geeksforgeeks.org/python-web-scraping-tutorial/

!pip install requests
!pip install beautifulsoup4

import csv
import requests
from bs4 import BeautifulSoup

time_series=[]
month=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
year=[2010]*11
for i in range(0,11):
   year[i]+=i


for years in year:
  for months in month:
  
    link="https://tcktcktck.org/manipur/"+months+"-"+str(years)
    r = requests.get(link)

    soup = BeautifulSoup(r.content, 'html.parser')

    s = soup.find("table",class_='tb7')
    content = s.find_all('tbody')
    content=s.find_all('tr') 

    left=2
    for c in content:
      if left>0:  #skipping firs two rows which contain col. information
        left-=1
        continue
      data=c.find_all('td')

      date=""
      temperature=""

      for index in range(len(data)):
        data[index]=str(data[index])
        
        if index==0:
          date=data[index][4:-5]
        elif index==1:
          temperature=data[index][9:-5]
        else:  #we don't need rest of the data
          break
      
      d={}
      d['Date (YYYY-MM-DD)']=date
      d['Temperature (in Fahrenheit)']=temperature
      time_series.append(d)

      print(date," ",temperature)


filename = 'manipur_temperature-2010-2020.csv'

with open(filename, 'w', newline='') as f:
    w = csv.DictWriter(f,['Date (YYYY-MM-DD)','Temperature (in Fahrenheit)'])
    w.writeheader()
    w.writerows(time_series)