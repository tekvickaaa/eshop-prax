from bs4 import BeautifulSoup
import requests
import json

i = 1
url = "https://datacomp.sk/pc-komponenty-pamate-ram_c73.html" 

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

products = soup.find_all(attrs={"class": "prodbox"})