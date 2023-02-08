Feature: Run an accessbility test

#Backgrounds: int/service/local, int/upload-form, int/service/upload

    #Set form to http://localhost:8123/static/files/test/passes.html
    #Set empty a-browser to chromium
    Serve files at /static from test
    #Given I'm using `a-browser` browser
    On the "http://localhost:8123/static/files/test/passes.html" webpage
    page is accessible accepting serious 5 and moderate 2


