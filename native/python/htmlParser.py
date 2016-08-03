from html.parser import HTMLParser
from html.entities import name2codepoint
from urllib import request

class MyHTMLParser(HTMLParser):

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            # print('<%s>' % tag)
            # print('%s' % attrs)
            fuck.append(attrs)
            # with open('fuck', 'w') as f:
            #     f.write(tag)
            #     f.close()

    # def handle_endtag(self, tag):
    #     print('</%s>' % tag)

    # def handle_startendtag(self, tag, attrs):
    #     print('<%s/>' % tag)

    # def handle_data(self, data):
    #     print(data)

    # def handle_comment(self, data):
    #     print('<!--', data, '-->')

    # def handle_entityref(self, name):
    #     print('&%s;' % name)

    # def handle_charref(self, name):
    #     print('&#%s;' % name)

def anaylse(x):
    _dict = { k : v for k, v in x}
    print(_dict)
    return _dict['src']
    # with _dict('src') as s:
        # fuck2.append(s)

with request.urlopen('http://www.baidu.com') as f:
    fuck = [];
    data = f.read()
    # print('Status:', f.status, f.reason)
    # for k, v in f.getheaders():
        # print('%s: %s' % (k, v))
    # print('Data:', data.decode('utf-8'))
    parser = MyHTMLParser()
    parser.feed(data.decode('utf-8'))
    r = map(anaylse, fuck)
    print(list(r))