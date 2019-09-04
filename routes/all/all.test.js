// import { Request } from 'jest-express/lib/request';
// import { Response } from 'jest-express/lib/response';
const all = require('./index');

describe('all', function () {
  it('should be a function', function () {
    expect(all).toBeInstanceOf(Function);
  });
});

// describe('render', function () {
//   let request;

//   beforeEach(() => {
//     request = new Request('/', {
//       headers: {
//         Accept: 'text/html'
//       }
//     });
//     response = new Response();
//   });

//   afterEach(() => {
//     request.resetMocked();
//     response.resetMocked();
//   });

//   it('should setup endpoint', () => {
//     all(request, response);
//     expect(request).toBeCalled();
//   });
// });