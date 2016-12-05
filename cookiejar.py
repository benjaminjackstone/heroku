class CookieJar:
    def __init__(self):
        self.cookielist = {}
        self.session = ""

    def SetCookie(self, session, cookie):
        self.session = session
        self.cookielist[self.session] = cookie
    def GetCookie(self):
        print(self.cookielist)
        return self.cookielist[self.session]
    def IsThereCookies(self):
        if len(self.cookielist) > 0:
            return True
        return False
