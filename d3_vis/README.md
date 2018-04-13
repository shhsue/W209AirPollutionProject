Start by launching the webserver with
(Python version 2.X)
```
python -m SimpleHTTPServer 8000
```
(Python version 3.X)
```
python -m http.server
```
navigate a browser to [http://localhost:8000/](http://localhost:8000/),
and hack away!

## Instructions for uploading to iSchool Using an FTP client
(such as FileZilla on Windows or Cyberduck on Mac)

1. Connect to the iSchool via the following credentials:
    host: ischool.berkeley.edu
    username: your iSchool username
    password: your iSchool password
    port: 22

2. Once you’re connected, you’ll see your pre-configured directories. Go into the folder called “public_html.”

3. Upload all files/folders necessary for your webpage in this folder, ensuring that “index.html” is placed just inside “public_html” (i.e. not buried in another folder within “public_html”)

4. After you’re done, your web page is publicly visible at the url: http://people.ischool.berkeley.edu/~your-username/ (be sure to include the “~” before your username.
