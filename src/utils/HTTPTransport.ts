export enum Method {
  // eslint-disable-next-line no-unused-vars
  GET = 'GET',
  // eslint-disable-next-line no-unused-vars
  POST = 'POST',
  // eslint-disable-next-line no-unused-vars
  PUT = 'PUT',
  // eslint-disable-next-line no-unused-vars
  DELETE = 'DELETE'
}

type Options = {
  method: Method;
  data?: any;
};

// eslint-disable-next-line no-unused-vars
type HTTPMethod = (url: string, options?: Options) => Promise<unknown>;

function queryStringify(data) {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
}

class HTTPTransport {
  get: HTTPMethod = (url, options = {}) => {
    return this.request(url,{ ...options, method: Method.GET },
    );
  };

  put: HTTPMethod = (url, options = {}) => {
    return this.request(url,{ ...options, method: Method.PUT },
    );
  };

  post: HTTPMethod = (url, options = {}) => {
    return this.request(url,{ ...options, method: Method.POST },
    );
  };

  delete: HTTPMethod = (url, options = {}) => {
    return this.request(url,{ ...options, method: Method.DELETE },
    );
  };

  request: HTTPMethod = (url, options = {}) => {
    const { method, data } = options;

    if (method === Method.GET && data) {
      url = url + queryStringify(data);
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (!method) {
        reject('Нет метода');
      }

      xhr.open(method, url);

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === Method.GET || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };
}

export default HTTPTransport;
