/*Libname data "\\laph.local\dph\profiles\e614951\Desktop\test\Data";*/
libname data "C:\Users\e614951\Desktop\testdata";
/* Import full dataset*/

/*PROC IMPORT OUT= data.check */
/*            DATAFILE= "\\laph.local\dph\profiles\e614951\Desktop\test\po*/
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
            DATAFILE= "\\laph.local\dph\profiles\e614951\Desktop\test\po
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

ods csv file="\\laph.local\dph\profiles\e614951\Desktop\test\Data\ca_airpollution_2000-2016.csv";
proc print data=data.nodup noobs;
run;
ods csv close;


proc contents data=data.nodup;
run;


/*Merge census data*/
PROC IMPORT OUT= DATA.Census2000 
            DATAFILE= "\\laph.local\dph\profiles\e614951\Desktop\test\ce
nsus2000.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;


PROC IMPORT OUT= DATA.Census2010 
            DATAFILE= "\\laph.local\dph\profiles\e614951\Desktop\test\ce
nsus2010.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;


proc sql;
create table data.pop as
select c0.GeoID, c0.target_geo_id, c0.geo_id2, c0.city, c10.city, c10.county,c0.pop_2000, c10.pop_2010
from data.census2000 as c0,
	data.census2010 as c10
where  c0.target_geo_id=c10.target_geo_id;
quit;

/*proc freq data=data.pop;*/
/*table city;*/
/*run;*/
/**/
/*proc print data=data.pop (obs=10)noobs;*/
/*run;*/

ods csv file="\\laph.local\dph\profiles\e614951\Desktop\test\Data\pop_2000_2010.csv";
proc print data=data.pop noobs;
run;
ods csv close;

/*merge zipcode and mortality*/
PROC IMPORT OUT= DATA.zip 
            DATAFILE= "\\laph.local\dph\profiles\e614951\Desktop\test\CA
_postal_codes.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
     DATAROW=2; 
	 guessingrows=32767;
RUN;

PROC IMPORT OUT= DATA.mortality 
            DATAFILE= "\\laph.local\dph\profiles\e614951\Desktop\test\le
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

ods csv file="\\laph.local\dph\profiles\e614951\Desktop\test\Data\mortality.csv";
proc print data= data.mortcity noobs;
run;
ods csv close;

/*clean population city names*/
data data.popclean;
	set data.pop;
if county="City and County of San Francisco" then county="San Francisco";
city=tranwrd(city, "CDP",'');
city=tranwrd(city,"city",'');
county=tranwrd(county,"County",'');
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
	drop geoid geo_id2 target_geo_id;
	merge data.mortcity (in=x) data.popclean (in=y);
	by city;
	if x=1 and y=1;
	if year=1999 then delete;
	if year in (2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009) then mort_rate=(deaths/pop_2000)*100000;
	if year in (2010, 2011, 2012, 2013, 2014, 2015) then mort_rate=(deaths/pop_2010)*100000;
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

ods csv file="\\laph.local\dph\profiles\e614951\Desktop\test\Data\mortalityrates.csv";
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
