"""
WSGI config for ascent_jet project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
import sys
import site


def resolve_variables(value):
    v = value.replace('$PWD', os.environ.get('PWD') + 'code')
    v = v.replace('$PYTHONPATH', os.environ.get('PYTHONPATH', ''))
    return v
try:
    with open(os.path.join(os.environ.get('PWD'), 'code/production'), 'r') as f:
        for line in f:
            if line.startswith('export'):
                kv = line.strip().split(' ')[1].split('=')
                if kv[0] == 'BASE_DIR':
                    os.environ.setdefault(kv[0], os.environ.get('PWD'))
                    PR = os.path.join(os.environ.get('PWD'), 'code')
                    sys.path.insert(0, PR)
                    sys.path.insert(0, os.path.join(PR, 'ascent_jet'))
                    site.addsitedir(os.path.join(PR, '../env/lib/python2.7/site-packages/'))
                elif kv[0] != 'PYTHONPATH':
                    os.environ.setdefault(kv[0], resolve_variables(kv[1]))
except IOError:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ascent_jet.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
