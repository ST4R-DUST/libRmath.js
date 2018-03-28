/* GNUv3 License

Copyright (c) Jacob K. F. Bogers <jkfbogers@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
import { dhyper } from './dhyper';
import { phyper } from './phyper';
import { qhyper } from './qhyper';
import { rhyper as _rhyper } from './rhyper';

import { IRNG } from '../rng/irng';
import { MersenneTwister } from '../rng/mersenne-twister';


export function HyperGeometric(rng: IRNG = new MersenneTwister()) {
  //rhyper(nn, m, n, k)
  function rhyper(N: number, nn1in: number, nn2in: number, kkin: number) {
    return _rhyper(N, nn1in, nn2in, kkin, rng);
  }

  return {
    dhyper,
    phyper,
    qhyper,
    rhyper
  };
}
