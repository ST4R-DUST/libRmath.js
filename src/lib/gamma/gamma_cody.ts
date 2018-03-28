/* GNUv3 License

Copyright (c) Jacob K. F. Bogers <jkfbogers@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


import { sinpi } from '../trigonometry';

const { PI: M_PI, log, exp, trunc } = Math;

const {
  EPSILON: DBL_EPSILON,
  MIN_VALUE: DBL_MIN,
  POSITIVE_INFINITY: ML_POSINF
} = Number;


export function Rf_gamma_cody(x: number) {
  /*
 *
 *  NOTES
   This routine calculates the GAMMA function for a float argument X.
   Computation is based on an algorithm outlined in reference [1].
   The program uses rational functions that approximate the GAMMA
   function to at least 20 significant decimal digits.	Coefficients
   for the approximation over the interval (1,2) are unpublished.
   Those for the approximation for X >= 12 are from reference [2].
   The accuracy achieved depends on the arithmetic system, the
   compiler, the intrinsic functions, and proper selection of the
   machine-dependent constants.

   *******************************************************************

   Error returns

   The program returns the value XINF for singularities or
   when overflow would occur.	 The computation is believed
   to be free of underflow and overflow.

   Intrinsic functions required are:

   INT, DBLE, EXP, LOG, REAL, SIN


   References:
   [1]  "An Overview of Software Development for Special Functions",
  W. J. Cody, Lecture Notes in Mathematics, 506,
  Numerical Analysis Dundee, 1975, G. A. Watson (ed.),
  Springer Verlag, Berlin, 1976.

   [2]  Computer Approximations, Hart, Et. Al., Wiley and sons, New York, 1968.

   Latest modification: October 12, 1989

   Authors: W. J. Cody and L. Stoltz
   Applied Mathematics Division
   Argonne National Laboratory
   Argonne, IL 60439
   ----------------------------------------------------------------------*/

  /* ----------------------------------------------------------------------
   Mathematical constants
   ----------------------------------------------------------------------*/
  const sqrtpi = 0.9189385332046727417803297; /* == ??? */

  /* *******************************************************************

   Explanation of machine-dependent constants

   beta	- radix for the floating-point representation
   maxexp - the smallest positive power of beta that overflows
   XBIG	- the largest argument for which GAMMA(X) is representable
  in the machine, i.e., the solution to the equation
  GAMMA(XBIG) = beta**maxexp
   XINF	- the largest machine representable floating-point number;
  approximately beta**maxexp
   EPS	- the smallest positive floating-point number such that  1.0+EPS > 1.0
   XMININ - the smallest positive floating-point number such that
  1/XMININ is machine representable

   Approximate values for some important machines are:

   beta	      maxexp	     XBIG

   CRAY-1		(S.P.)	      2		8191	    966.961
   Cyber 180/855
   under NOS	(S.P.)	      2		1070	    177.803
   IEEE (IBM/XT,
   SUN, etc.)	(S.P.)	      2		 128	    35.040
   IEEE (IBM/XT,
   SUN, etc.)	(D.P.)	      2		1024	    171.624
   IBM 3033	(D.P.)	     16		  63	    57.574
   VAX D-Format	(D.P.)	      2		 127	    34.844
   VAX G-Format	(D.P.)	      2		1023	    171.489

   XINF	 EPS	    XMININ

   CRAY-1		(S.P.)	 5.45E+2465   7.11E-15	  1.84E-2466
   Cyber 180/855
   under NOS	(S.P.)	 1.26E+322    3.55E-15	  3.14E-294
   IEEE (IBM/XT,
   SUN, etc.)	(S.P.)	 3.40E+38     1.19E-7	  1.18E-38
   IEEE (IBM/XT,
   SUN, etc.)	(D.P.)	 1.79D+308    2.22D-16	  2.23D-308
   IBM 3033	(D.P.)	 7.23D+75     2.22D-16	  1.39D-76
   VAX D-Format	(D.P.)	 1.70D+38     1.39D-17	  5.88D-39
   VAX G-Format	(D.P.)	 8.98D+307    1.11D-16	  1.12D-308

   *******************************************************************

   ----------------------------------------------------------------------
   Machine dependent parameters
   ----------------------------------------------------------------------
   */

  const xbig = 171.624;
  /* ML_POSINF ==   const double xinf = 1.79e308;*/
  /* DBL_EPSILON = const double eps = 2.22e-16;*/
  /* DBL_MIN ==   const double xminin = 2.23e-308;*/

  /*----------------------------------------------------------------------
  Numerator and denominator coefficients for rational minimax
  approximation over (1,2).
  ----------------------------------------------------------------------*/
  const p = [
    -1.71618513886549492533811,
    24.7656508055759199108314,
    -379.804256470945635097577,
    629.331155312818442661052,
    866.966202790413211295064,
    -31451.2729688483675254357,
    -36144.4134186911729807069,
    66456.1438202405440627855
  ];
  const q = [
    -30.8402300119738975254353,
    315.350626979604161529144,
    -1015.15636749021914166146,
    -3107.77167157231109440444,
    22538.1184209801510330112,
    4755.84627752788110767815,
    -134659.959864969306392456,
    -115132.259675553483497211
  ];
  /*----------------------------------------------------------------------
  Coefficients for minimax approximation over (12, INF).
  ----------------------------------------------------------------------*/
  const c = [
    -0.001910444077728,
    8.4171387781295e-4,
    -5.952379913043012e-4,
    7.93650793500350248e-4,
    -0.002777777777777681622553,
    0.08333333333333333331554247,
    0.0057083835261
  ];

  /* Local variables */
  //int
  let i: number;
  let n: number;
  let parity: number; /*logical*/

  //double
  let fact: number;
  let xden: number;
  let xnum: number;
  let y: number;
  let z: number;
  let yi: number;
  let res: number;
  let sum: number;
  let ysq: number;

  parity = 0;
  fact = 1;
  n = 0;
  y = x;
  if (y <= 0) {
    /* -------------------------------------------------------------
     Argument is negative
     ------------------------------------------------------------- */
    y = -x;
    yi = trunc(y);
    res = y - yi;
    if (res !== 0) {
      if (yi !== trunc(yi * 0.5) * 2) {
        parity = 1;
      }
      fact = -M_PI / sinpi(res);
      y += 1;
    } else {
      return ML_POSINF;
    }
  }
  /* -----------------------------------------------------------------
   Argument is positive
   -----------------------------------------------------------------*/
  if (y < DBL_EPSILON) {
    /* --------------------------------------------------------------
     Argument < EPS
     -------------------------------------------------------------- */
    if (y >= DBL_MIN) {
      res = 1 / y;
    } else {
      return ML_POSINF;
    }
  } else if (y < 12) {
    yi = y;
    if (y < 1) {
      /* ---------------------------------------------------------
       EPS < argument < 1
       --------------------------------------------------------- */
      z = y;
      y += 1;
    } else {
      /* -----------------------------------------------------------
       1 <= argument < 12, reduce argument if necessary
       ----------------------------------------------------------- */
      n = trunc(y) - 1;
      y -= n;
      z = y - 1;
    }
    /* ---------------------------------------------------------
     Evaluate approximation for 1. < argument < 2.
     ---------------------------------------------------------*/
    xnum = 0;
    xden = 1;
    for (i = 0; i < 8; ++i) {
      xnum = (xnum + p[i]) * z;
      xden = xden * z + q[i];
    }
    res = xnum / xden + 1;
    if (yi < y) {
      /* --------------------------------------------------------
       Adjust result for case  0. < argument < 1.
       -------------------------------------------------------- */
      res /= yi;
    } else if (yi > y) {
      /* ----------------------------------------------------------
       Adjust result for case  2. < argument < 12.
       ---------------------------------------------------------- */
      for (i = 0; i < n; ++i) {
        res *= y;
        y += 1;
      }
    }
  } else {
    /* -------------------------------------------------------------
     Evaluate for argument >= 12.,
     ------------------------------------------------------------- */
    if (y <= xbig) {
      ysq = y * y;
      sum = c[6];
      for (i = 0; i < 6; ++i) {
        sum = sum / ysq + c[i];
      }
      sum = sum / y - y + sqrtpi;
      sum += (y - 0.5) * log(y);
      res = exp(sum);
    } else {
      return ML_POSINF;
    }
  }
  /* ----------------------------------------------------------------------
   Final adjustments and return
   ----------------------------------------------------------------------*/
  if (parity) res = -res;
  if (fact !== 1) res = fact / res;
  return res;
}
