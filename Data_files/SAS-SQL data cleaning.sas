
libname data "C:\Users\testdata";
/* Import full dataset*/

/*PROC IMPORT OUT= data.check */
/*            DATAFILE= "\\laph.local\dph\profiles\test\po*/
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
            DATAFILE= "\\laph.local\dph\profiles\test\po
llution_data_2000_2016.xlsx" 
            DBMS=EXCEL REPLACE;
     RANGE="pollution_ca_2000_2016$"; 
     GETNAMES=YES;
     MIXED=NO;
     SCANTEXT=YES;
     USEDATE=YES;
     SCANTIME=YES;
RUN;

/*Check CA observations*/
proc freq data=data.pollutionca;
table city;
run;


proc contents data=data.pollutionca position;
run;


proc sql;
create table data.clean as
select site_num, address, state, county, city, date_local,  
		avg(CO_1st_Max_Hour) as co_maxhour, 
		avg(CO_1st_Max_Value) as co_maxvalue, 
		avg(CO_AQI) as co_aqi_level, 
		avg(CO_Mean) as co_avg, 
		CO_Units, 
		avg(NO2_1st_Max_Hour) as no2_maxhour, 
		avg(NO2_1st_Max_Value) as no2_maxvalue, 
		avg(NO2_AQI) as no2_aqi_level, 
		avg(NO2_Mean) as no2_avg, 
		NO2_Units,
		avg(O3_1st_Max_Hour) as o3_maxhour, 
		avg(O3_1st_Max_Value) as o3_maxvalue, 
		avg(O3_AQI) as o3_aqi_level, 
		avg(O3_Mean) as o3_avg, 
		O3_Units, 
		avg(SO2_1st_Max_Hour) as so2_maxhour, 
		avg(SO2_1st_Max_Value) as so2_maxvalue, 
		avg(SO2_AQI) as so2_aqi_level, 
		avg(SO2_Mean) as so2_avg, 
		SO2_Units 

from data.pollutionca
group by state, city, county, date_local;
quit;

proc print data=data.clean (obs=10);
run;


proc sql;
create table data.nodup as
select distinct *
from data.clean;
quit;

proc print data=data.nodup (obs=10);
run;

ods csv file="\\laph.local\dph\profiles\test\Data\ca_airpollution_2000-2016.csv";
proc print data=data.nodup noobs;
run;
ods csv close;


proc contents data=data.nodup;
run;


/*Merge census and ACS data*/
PROC IMPORT OUT= DATA.Census2000 
            DATAFILE= "\\laph.local\dph\profiles\test\ce
nsus2000.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS05_09 
            DATAFILE= "C:\Users\testdata\ACS_09_5YR_B01003.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.Census2010 
            DATAFILE= "\\laph.local\dph\profiles\test\ce
nsus2010.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS10 
            DATAFILE= "C:\Users\testdata\ACS_10_5YR_B01003.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS11 
            DATAFILE= "C:\Users\testdata\ACS_11_5YR_B01003.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS12 
            DATAFILE= "C:\Users\testdata\ACS_12_5YR_B01003.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS13 
            DATAFILE= "C:\Users\testdata\ACS_13_5YR_B01003.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS14 
            DATAFILE= "C:\Users\testdata\ACS_14_5YR_B01003.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS15 
            DATAFILE= "C:\Users\testdata\ACS_15_5YR_B01003.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.ACS16 
            DATAFILE= "C:\Users\testdata\ACS_16_5YR_B01003.csv" 
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

ods csv file="\\laph.local\dph\profiles\test\Data\pop_2000_2010.csv";
proc print data=data.pop noobs;
run;
ods csv close;

/*merge zipcode and mortality*/
PROC IMPORT OUT= DATA.zip 
            DATAFILE= "\\laph.local\dph\profiles\test\CA
_postal_codes.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.mortality 
            DATAFILE= "\\laph.local\dph\profiles\test\le
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
select place_name as city, county, year, causes_of_death, sum(count) as deaths
from data.mortzip 
group by city, county, year, causes_of_death;
quit;

proc print data= data.mortcity (obs=10) noobs;
run;

ods csv file="\\laph.local\dph\profiles\test\Data\mortality.csv";
proc print data= data.mortcity noobs;
run;
ods csv close;

/*clean population city names*/
data data.popclean;
	set data.pop;
/*if county="City and County of San Francisco" then county="San Francisco";*/
city=tranwrd(city, "CDP",'');
city=tranwrd(city, "city",'');
city=tranwrd(city, "CDP, California",'');
city=tranwrd(city, "city, California",'');
county=tranwrd(county,"County",'');
county=tranwrd(county,"City and County of San Francisco", "San Francisco");
run;

/**/
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
	length city $37. cause $255.;
	drop id target_geo_id pop_16;
	merge data.mortcity (in=x) data.popclean (in=y);
	by city;
	if x=1 and y=1;
	if year=1999 then delete;
	if year in (2000, 2001, 2002, 2003, 2004) then mort_rate=(deaths/pop_2000)*100000;
	if year in (2005, 2006, 2007, 2008, 2009) then mort_rate=(deaths/pop_05_09)*100000;
	if year in (2010) then mort_rate=(deaths/pop_2010)*100000;
	if year in (2011) then mort_rate=(deaths/pop_11)*100000;
	if year in (2012) then mort_rate=(deaths/pop_12)*100000;
	if year in (2013) then mort_rate=(deaths/pop_13)*100000;
	if year in (2014) then mort_rate=(deaths/pop_14)*100000;
	if year in (2015) then mort_rate=(deaths/pop_15)*100000;
/*	if year in (2016) then mort_rate=(deaths/pop_16)*100000;*/
	if causes_of_death="HTD" then cause="Diseases of the Heart";
	if causes_of_death="CAN" then cause="Cancers";
	if causes_of_death="STK" then cause="Stroke";
	if causes_of_death="CLD" then cause="Chronic Lower Respiratory Disease";
	if causes_of_death="INJ" then cause="Unintentional Injuries";
	if causes_of_death="PNF" then cause="Pneumonia and Influenza";
	if causes_of_death="DIA" then cause="Diabetes Mellitus";
	if causes_of_death="ALZ" then cause="Alzheimer's Disease";
	if causes_of_death="LIV" then cause="Chronic Liver Disease and Cirrhosis";
	if causes_of_death="SUI" then cause="Suicide";
	if causes_of_death="HYP" then cause="Hypertension and Hypertensive Renal Disease";
	if causes_of_death="HOM" then cause="Homicide";
	if causes_of_death="NEP" then cause="Nephritis, Nephrotic Syndrome and Nephrosis";
	if causes_of_death="OTH" then cause="All Other Causes of Death";
run;

proc print data=data.mortrate (obs=5) noobs;
run;

ods csv file="C:\Users\testdata\mortalityrates.csv";
proc print data=data.mortrate noobs;
run;
ods csv close;

/*proc sql;*/
/*create table data.mortratetest as*/
/*select pop.city, pop.county, pop.pop_2000, pop.pop_2010, death.year, death.causes_of_death, death.deaths*/
/*from data.mortcity as death, data.popclean as pop */
/*where pop.city=death.place_name and pop.county=death.county;*/
/*quit;*/

/*proc sort data=test.nodup;*/
/*by city county;*/
/*run;*/
/**/
/*proc sort data=test.mortrate;*/
/*by city county;*/
/*run;*/
/**/
/**/
/*data test.merged;*/
/*	drop causes_of_death;*/
/*	merge test.nodup(in=x) test.mortrate(in=y);*/
/*	by city;*/
/*	if x=1 and y=1;*/
/*run;*/
/*	*/
