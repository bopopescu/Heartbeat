import pystache

class Register(pystache.View):
  def set_errors(self, errors):
    self.__errors = errors
  def set_data(self, data):
    self.__data = data
  def errors(self):
    return self.__errors
  def data(self):
    return self.__data
