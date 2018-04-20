libname data "C:\Users\Desktop\testdata";
/* Import full dataset*/

/*PROC IMPORT OUT= data.check */
/*            DATAFILE= "C:\Users\Desktop\testdata\po*/
/*llution_data_2000_2016.xlsx" */
/*            DBMS=EXCEL REPLACE;*/
/*     RANGE="pollution_us_2000_2016$"; */
/*     GETNAMES=YES;*/
/*     MIXED=NO;*/
/*     SCANTEXT=YES;*/
/*     USEDATE=YES;*/
/*     SCANTIME=YES;*/
/*	 guessingrows=32767;*/
/**/
/*RUN;*/


/*Import subset dataset*/
PROC IMPORT OUT= data.pollutionca
            DATAFILE= "C:\Users\Desktop\testdata\CApollution.xlsx"
            DBMS=EXCEL REPLACE;
     RANGE="CA$";
     GETNAMES=YES;
     MIXED=NO;
     SCANTEXT=YES;
     USEDATE=YES;
     SCANTIME=YES;
RUN;

/*Check CA observations*/
/*proc freq data=data.pollutionca;*/
/*table date_local;*/
/*where city='Bakersfield';*/
/*run;*/


proc contents data=data.pollutionca position;
run;


proc sql;
create table data.clean as
select city, county, date_local,
		avg(CO_AQI) as co_aqi_level,
		avg(NO2_AQI) as no2_aqi_level,
		avg(O3_AQI) as o3_aqi_level,
		avg(SO2_AQI) as so2_aqi_level,
		year(date_local) as year,
		put(month(date_local),z2.) as month
from data.pollutionca
where city not in ('Not in a city')
group by county, city, date_local;
quit;

proc print data=data.clean (obs=10) noobs;
run;

proc freq data=data.clean;
table year;
where city='Bakersfield';
run;

data monthyear;
	set data.clean;
	date=catx('-',year,month);
run;

proc print data=monthyear (obs=10) noobs;
run;


proc sql;
create table data.nodup as
select distinct *
from monthyear;
quit;

proc print data=data.nodup (obs=10) noobs;
run;

proc freq data=data.nodup;
table date_local city;
run;

/*ods csv file="C:\Users\Desktop\testdata\pollution_full.csv";*/
/*proc print data=data.nodup noobs;*/
/*run;*/
/*ods csv close;*/

proc sql;
create table data.poll_mon as
select city, county, date, year,
		avg(co_aqi_level) as co_aqi_level,
		avg(no2_aqi_level) as no2_aqi_level,
		avg(o3_aqi_level) as o3_aqi_level,
		avg(so2_aqi_level) as so2_aqi_level
from data.nodup
group by city, county, date;
quit;

proc sql;
create table data.poll_month as
select distinct *
from data.poll_mon
group by city, county, date, year;
quit;

proc print data=data.poll_month (obs=20) noobs;
run;

ods csv file="C:\Users\Desktop\testdata\pollution_months.csv";
proc print data=data.poll_month noobs;
run;
ods csv close;

proc contents data=data.pollution_month;
run;


/*Merge census and ACS data*/
PROC IMPORT OUT= DATA.Census2000
            DATAFILE= "C:\Users\Desktop\testdata\ce
nsus2000.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS05_09
            DATAFILE= "C:\Users\Desktop\testdata\ACS_09_5YR_B01003.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.Census2010
            DATAFILE= "C:\Users\Desktop\testdata\ce
nsus2010.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS10
            DATAFILE= "C:\Users\Desktop\testdata\ACS_10_5YR_B01003.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS11
            DATAFILE= "C:\Users\Desktop\testdata\ACS_11_5YR_B01003.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS12
            DATAFILE= "C:\Users\Desktop\testdata\ACS_12_5YR_B01003.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS13
            DATAFILE= "C:\Users\Desktop\testdata\ACS_13_5YR_B01003.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS14
            DATAFILE= "C:\Users\Desktop\testdata\ACS_14_5YR_B01003.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS15
            DATAFILE= "C:\Users\Desktop\testdata\ACS_15_5YR_B01003.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS16
            DATAFILE= "C:\Users\Desktop\testdata\ACS_16_5YR_B01003.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

proc sql;
create table data.pop as
select c9.id, c0.target_geo_id, c0.city, c10.city, c10.county,c0.pop_2000,
	c9.pop_05_09, c10.pop_2010, c11.pop_11, c12.pop_12, c13.pop_13, c14.pop_14, c15.pop_15, c16.pop_16
from data.census2000 as c0,
	data.acs05_09 as c9,
	data.census2010 as c10,
	data.acs11 as c11,
	data.acs12 as c12,
	data.acs13 as c13,
	data.acs14 as c14,
	data.acs15 as c15,
	data.acs16 as c16
where  c0.target_geo_id=c9.id and c0.target_geo_id=c10.target_geo_id
	 and c0.target_geo_id=c11.id and c0.target_geo_id=c12.id
	 and c0.target_geo_id=c13.id and c0.target_geo_id=c14.id
	 and c0.target_geo_id=c15.id and c0.target_geo_id=c16.id;
quit;

/*proc freq data=data.pop;*/
/*table city;*/
/*run;*/
/**/
/*proc print data=data.pop (obs=10)noobs;*/
/*run;*/

ods csv file="C:\Users\Desktop\testdata\Data\pop_2000_2010.csv";
proc print data=data.pop noobs;
run;
ods csv close;

/*merge zipcode and mortality*/
PROC IMPORT OUT= DATA.zip
            DATAFILE= "C:\Users\Desktop\testdata\CA
_postal_codes.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.mortality
            DATAFILE= "C:\Users\Desktop\testdata\le
ading-causes-of-death-by-zip-code-1999-2015.csv"
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2;
	 guessingrows=32767;
RUN;

proc sql;
create table data.mortzip as
select *
from data.zip as zip,
	data.mortality as m
where  zip.zip_code=m.zip_code;
quit;


/*proc print data=data.mortzip (obs=10) noobs;*/
/*run;*/


proc sql;
create table data.mortcity as
select place_name as city, county, year, Latitude, Longitude, causes_of_death, sum(count) as deaths
from data.mortzip
group by city, county, year, causes_of_death;
quit;

proc print data= data.mortcity (obs=10) noobs;
run;

ods csv file="C:\Users\Desktop\testdata\Data\mortality.csv";
proc print data= data.mortcity noobs;
run;
ods csv close;

proc sql;
create table data.pop_city as
select *
from data.pop
where city NOT CONTAINS ('CDP');
quit;

/*proc freq data=data.pop_city;*/
/*table city;*/
/*run;*/

/*clean population city names*/
data data.popclean;
	set data.pop_city;
if city="Burbank CDP" then delete;
if county="City and County of San Francisco" then county="San Francisco";
/*city=tranwrd(city, "CDP",'');*/
city=tranwrd(city, "city",'');
/*city=tranwrd(city, "CDP, California",'');*/
city=tranwrd(city, "city, California",'');
county=tranwrd(county,"County",'');
run;

/*proc freq data=data.popclean;*/
/*table city county;*/
/*run;*/

/*proc freq data=data.mortcity;*/
/*table city county;*/
/*run;*/

proc contents data=data.popclean;
run;

proc contents data=data.mortcity;
run;

proc sort data=data.mortcity;
by city county;
run;

proc sort data=data.popclean;
by city county;
run;

data data.mortrate;
	length city $37.;* cause $255.;
	drop id target_geo_id pop_16;
	merge data.mortcity (in=x) data.popclean (in=y);
	by city;
	if x=1 and y=1;
	if year=1999 then delete;
	if city='Kirkwood' then county='Alpine';
	if year in (2000, 2001, 2002, 2003, 2004) then mort_rate=(deaths/pop_2000)*100000;
	if year in (2005, 2006, 2007, 2008, 2009) then mort_rate=(deaths/pop_05_09)*100000;
	if year in (2010) then mort_rate=(deaths/pop_2010)*100000;
	if year in (2011) then mort_rate=(deaths/pop_11)*100000;
	if year in (2012) then mort_rate=(deaths/pop_12)*100000;
	if year in (2013) then mort_rate=(deaths/pop_13)*100000;
	if year in (2014) then mort_rate=(deaths/pop_14)*100000;
	if year in (2015) then mort_rate=(deaths/pop_15)*100000;
/*	if year in (2016) then mort_rate=(deaths/pop_16)*100000;*/
/*	if causes_of_death="HTD" then cause="Diseases of the Heart";*/
/*	if causes_of_death="CAN" then cause="Cancers";*/
/*	if causes_of_death="STK" then cause="Stroke";*/
/*	if causes_of_death="CLD" then cause="Chronic Lower Respiratory Disease";*/
/*	if causes_of_death="INJ" then cause="Unintentional Injuries";*/
/*	if causes_of_death="PNF" then cause="Pneumonia and Influenza";*/
/*	if causes_of_death="DIA" then cause="Diabetes Mellitus";*/
/*	if causes_of_death="ALZ" then cause="Alzheimer's Disease";*/
/*	if causes_of_death="LIV" then cause="Chronic Liver Disease and Cirrhosis";*/
/*	if causes_of_death="SUI" then cause="Suicide";*/
/*	if causes_of_death="HYP" then cause="Hypertension and Hypertensive Renal Disease";*/
/*	if causes_of_death="HOM" then cause="Homicide";*/
/*	if causes_of_death="NEP" then cause="Nephritis, Nephrotic Syndrome and Nephrosis";*/
/*	if causes_of_death="OTH" then cause="All Other Causes of Death";*/
run;

proc print data=data.mortrate noobs;
where city = 'Burbank';
run;

ods csv file="C:\Users\Desktop\testdata\mortality_notran.csv";
proc print data=data.mortrate noobs;
run;
ods csv close;

proc sql;
create table data.HTD as
select city, County, year, Latitude, Longitude,
	mort_rate as HTD
from data.mortrate
where causes_of_death in ("HTD");
quit;

proc sql;
create table data.CAN as
select city, County, year, Latitude, Longitude,
	mort_rate as CAN
from data.mortrate
where causes_of_death in ("CAN");
quit;

proc sql;
create table data.STK as
select city, County, year, Latitude, Longitude,
	mort_rate as STK
from data.mortrate
where causes_of_death in ("STK");
quit;

proc sql;
create table data.CLD as
select city, County, year, Latitude, Longitude,
	mort_rate as CLD
from data.mortrate
where causes_of_death in ("CLD");
quit;

proc sql;
create table data.PNF as
select city, County, year, Latitude, Longitude,
	mort_rate as PNF
from data.mortrate
where causes_of_death in ("PNF");
quit;

proc sort data=data.htd;
by city county year latitude longitude;
run;

proc sort data=data.can;
by city county year latitude longitude;
run;

proc sort data=data.stk;
by city county year latitude longitude;
run;

proc sort data=data.cld;
by city county year latitude longitude;
run;

proc sort data=data.pnf;
by city county year latitude longitude;
run;

data data.mortrate_trans;
	merge data.HTD data.CAN data.STK data.CLD data.PNF;
	by city county year latitude longitude;
	if county='City and County of San Francisco' then county='San Francisco';
run;

proc print data=data.mortrate_trans (obs=10) noobs;
run;

proc freq data=data.mortrate_trans;
table city county;
run;

ods csv file="C:\Users\Desktop\testdata\mortalityrates_full.csv";
proc print data=data.mortrate_trans noobs;
run;
ods csv close;

/*proc sort data=data.nodup;*/
/*by city year;*/
/*run;*/

proc sort data=data.poll_month;
by city year;
run;

proc sort data=data.mortrate_trans;
by city year;
run;

/*proc contents data=data.nodup;*/
/*run;*/
/**/
/*proc contents data=data.mortrate_trans;*/
/*run;*/

data data.merged_month;
	length city $25. county $32;
	merge data.poll_month(in=x) data.mortrate_trans(in=y);
	by city year;
	if x=1 and y=1;
	drop month;
	format co_aqi_level so2_aqi_level no2_aqi_level o3_aqi_level 3.0 HTD CAN STK CLD PNF 4.1;
run;

proc contents data= data.merged_month position;
run;

proc freq data= data.merged_month;
table date;
where city='Berkeley';
run;


proc print data= data.merged_month (obs=20) noobs;
run;

proc sql;
create table data.merge_clean as
select city, county, date, year, co_aqi_level, no2_aqi_level, o3_aqi_level, so2_aqi_level,
	avg(Latitude) as latitude,
	avg(Longitude) as longitude,
	HTD,
	CAN,
	STK,
	CLD
from data.merged_month
group by city, county;
quit;


proc print data= data.merge_clean (obs=20) noobs;
run;

proc sql;
create table data.merge_final as
select distinct *
from data.merge_clean
group by city, county, date;
quit;


proc print data= data.merge_final (obs=20) noobs;
run;

ods csv file="C:\Users\Desktop\testdata\merged_final.csv";
proc print data= data.merge_final noobs;
format co_aqi_level so2_aqi_level no2_aqi_level o3_aqi_level 3.0 HTD CAN STK CLD 4.1;
run;
ods csv close;
