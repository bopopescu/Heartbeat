#!/usr/bin/python

import os
from subprocess import check_output, call

PROJECT_DIR = os.path.dirname(__file__)

STATIC_FILES_DIR = os.path.join(os.getcwd(), "heartbeat", "common", "static")

ENVIRON = [
    'GMAIL_SMTP_USER',
    'GMAIL_SMTP_PASSWORD',
    'MEMCACHE_SERVERS',
    'MEMCACHE_USERNAME',
    'MEMCACHE_PASSWORD',
    'MEMCACHIER_SERVERS',
    'STRIPE_PROD_API_KEY',
    'STRIPE_TEST_API_KEY',
]
print "Checking environ vars..."
for var in ENVIRON:
  sts = check_output(["cd " + PROJECT_DIR + "; heroku config:get " + var], shell=True)
  if sts is None or sts == '':
    raise Exception('Undefined environ var: %s' % var)
print "Server has all environ vars"

print "Compiling js..."
print STATIC_FILES_DIR
call(['node', 'heartbeat/common/static/js/r.js', '-o', 'heartbeat/common/static/js/build.js'])
print "Compiling css..."
call(['lessc', 'heartbeat/common/static/css/application.less', 'heartbeat/common/static/application.css', '--compress'])

print "Pushing to github.."
call(['git', 'add', 'heartbeat/common/static/main-built.js'])
call(['git', 'add', 'heartbeat/common/static/application.css'])
call(['git', 'commit', '-m', '"Generated commit, built js and css"'])

call(['git', 'push', 'origin', 'master'])
print "Pushing to heroku.."
#call(['cd ' + PROJECT_DIR + '; git push heroku master'])
#call(['cd ' + PROJECT_DIR + '; heroku run ./manage.py migrate'])

