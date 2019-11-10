var __extends = this && this.__extends || function () {
    var t = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function (t, e) {
      t.__proto__ = e
    } || function (t, e) {
      for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r])
    };
    return function (e, r) {
      function n() {
        this.constructor = e
      }
      t(e, r), e.prototype = null === r ? Object.create(r) : (n.prototype = r.prototype, new n)
    }
  }(),
  spine;
(function (t) {
  var e = function () {
    function t(t, e, r) {
      if (null == t) throw new Error("name cannot be null.");
      if (null == e) throw new Error("timelines cannot be null.");
      this.name = t, this.timelines = e, this.duration = r
    }
    return t.prototype.apply = function (t, e, r, n, i, a, o, s) {
      if (null == t) throw new Error("skeleton cannot be null.");
      n && 0 != this.duration && (r %= this.duration, e > 0 && (e %= this.duration));
      for (var h = this.timelines, l = 0, u = h.length; l < u; l++) h[l].apply(t, e, r, i, a, o, s)
    }, t.binarySearch = function (t, e, r) {
      void 0 === r && (r = 1);
      var n = 0,
        i = t.length / r - 2;
      if (0 == i) return r;
      for (var a = i >>> 1;;) {
        if (t[(a + 1) * r] <= e ? n = a + 1 : i = a, n == i) return (n + 1) * r;
        a = n + i >>> 1
      }
    }, t.linearSearch = function (t, e, r) {
      for (var n = 0, i = t.length - r; n <= i; n += r)
        if (t[n] > e) return n;
      return -1
    }, t
  }();
  t.Animation = e;
  var r;
  (function (t) {
    t[t.setup = 0] = "setup", t[t.current = 1] = "current", t[t.currentLayered = 2] = "currentLayered"
  })(r = t.MixPose || (t.MixPose = {}));
  var n;
  (function (t) {
    t[t.in = 0] = "in", t[t.out = 1] = "out"
  })(n = t.MixDirection || (t.MixDirection = {}));
  var i;
  (function (t) {
    t[t.rotate = 0] = "rotate", t[t.translate = 1] = "translate", t[t.scale = 2] = "scale", t[t.shear = 3] = "shear", t[t.attachment = 4] = "attachment", t[t.color = 5] = "color", t[t.deform = 6] = "deform", t[t.event = 7] = "event", t[t.drawOrder = 8] = "drawOrder", t[t.ikConstraint = 9] = "ikConstraint", t[t.transformConstraint = 10] = "transformConstraint", t[t.pathConstraintPosition = 11] = "pathConstraintPosition", t[t.pathConstraintSpacing = 12] = "pathConstraintSpacing", t[t.pathConstraintMix = 13] = "pathConstraintMix", t[t.twoColor = 14] = "twoColor"
  })(i = t.TimelineType || (t.TimelineType = {}));
  var a = function () {
    function e(r) {
      if (r <= 0) throw new Error("frameCount must be > 0: " + r);
      this.curves = t.Utils.newFloatArray((r - 1) * e.BEZIER_SIZE)
    }
    return e.prototype.getFrameCount = function () {
      return this.curves.length / e.BEZIER_SIZE + 1
    }, e.prototype.setLinear = function (t) {
      this.curves[t * e.BEZIER_SIZE] = e.LINEAR
    }, e.prototype.setStepped = function (t) {
      this.curves[t * e.BEZIER_SIZE] = e.STEPPED
    }, e.prototype.getCurveType = function (t) {
      var r = t * e.BEZIER_SIZE;
      if (r == this.curves.length) return e.LINEAR;
      var n = this.curves[r];
      return n == e.LINEAR ? e.LINEAR : n == e.STEPPED ? e.STEPPED : e.BEZIER
    }, e.prototype.setCurve = function (t, r, n, i, a) {
      var o = .03 * (2 * -r + i),
        s = .03 * (2 * -n + a),
        h = .006 * (3 * (r - i) + 1),
        l = .006 * (3 * (n - a) + 1),
        u = 2 * o + h,
        c = 2 * s + l,
        d = .3 * r + o + .16666667 * h,
        p = .3 * n + s + .16666667 * l,
        f = t * e.BEZIER_SIZE,
        v = this.curves;
      v[f++] = e.BEZIER;
      for (var M = d, g = p, m = f + e.BEZIER_SIZE - 1; f < m; f += 2) v[f] = M, v[f + 1] = g, d += u, p += c, u += h, c += l, M += d, g += p
    }, e.prototype.getCurvePercent = function (r, n) {
      n = t.MathUtils.clamp(n, 0, 1);
      var i = this.curves,
        a = r * e.BEZIER_SIZE,
        o = i[a];
      if (o == e.LINEAR) return n;
      if (o == e.STEPPED) return 0;
      a++;
      for (var s = 0, h = a, l = a + e.BEZIER_SIZE - 1; a < l; a += 2)
        if (s = i[a], s >= n) {
          var u = void 0,
            c = void 0;
          return a == h ? (u = 0, c = 0) : (u = i[a - 2], c = i[a - 1]), c + (i[a + 1] - c) * (n - u) / (s - u)
        } var d = i[a - 1];
      return d + (1 - d) * (n - s) / (1 - s)
    }, e.LINEAR = 0, e.STEPPED = 1, e.BEZIER = 2, e.BEZIER_SIZE = 19, e
  }();
  t.CurveTimeline = a;
  var o = function (n) {
    function a(e) {
      var r = n.call(this, e) || this;
      return r.frames = t.Utils.newFloatArray(e << 1), r
    }
    return __extends(a, n), a.prototype.getPropertyId = function () {
      return (i.rotate << 24) + this.boneIndex
    }, a.prototype.setFrame = function (t, e, r) {
      t <<= 1, this.frames[t] = e, this.frames[t + a.ROTATION] = r
    }, a.prototype.apply = function (t, n, i, o, s, h, l) {
      var u = this.frames,
        c = t.bones[this.boneIndex];
      if (i < u[0]) switch (h) {
        case r.setup:
          return void(c.rotation = c.data.rotation);
        case r.current:
          var d = c.data.rotation - c.rotation;
          d -= 360 * (16384 - (16384.499999999996 - d / 360 | 0)), c.rotation += d * s
      } else if (i >= u[u.length - a.ENTRIES])
        if (h == r.setup) c.rotation = c.data.rotation + u[u.length + a.PREV_ROTATION] * s;
        else {
          var p = c.data.rotation + u[u.length + a.PREV_ROTATION] - c.rotation;
          p -= 360 * (16384 - (16384.499999999996 - p / 360 | 0)), c.rotation += p * s
        }
      else {
        var f = e.binarySearch(u, i, a.ENTRIES),
          v = u[f + a.PREV_ROTATION],
          M = u[f],
          g = this.getCurvePercent((f >> 1) - 1, 1 - (i - M) / (u[f + a.PREV_TIME] - M)),
          m = u[f + a.ROTATION] - v;
        m -= 360 * (16384 - (16384.499999999996 - m / 360 | 0)), m = v + m * g, h == r.setup ? (m -= 360 * (16384 - (16384.499999999996 - m / 360 | 0)), c.rotation = c.data.rotation + m * s) : (m = c.data.rotation + m - c.rotation, m -= 360 * (16384 - (16384.499999999996 - m / 360 | 0)), c.rotation += m * s)
      }
    }, a.ENTRIES = 2, a.PREV_TIME = -2, a.PREV_ROTATION = -1, a.ROTATION = 1, a
  }(a);
  t.RotateTimeline = o;
  var s = function (n) {
    function a(e) {
      var r = n.call(this, e) || this;
      return r.frames = t.Utils.newFloatArray(e * a.ENTRIES), r
    }
    return __extends(a, n), a.prototype.getPropertyId = function () {
      return (i.translate << 24) + this.boneIndex
    }, a.prototype.setFrame = function (t, e, r, n) {
      t *= a.ENTRIES, this.frames[t] = e, this.frames[t + a.X] = r, this.frames[t + a.Y] = n
    }, a.prototype.apply = function (t, n, i, o, s, h, l) {
      var u = this.frames,
        c = t.bones[this.boneIndex];
      if (i < u[0]) switch (h) {
        case r.setup:
          return c.x = c.data.x, void(c.y = c.data.y);
        case r.current:
          c.x += (c.data.x - c.x) * s, c.y += (c.data.y - c.y) * s
      } else {
        var d = 0,
          p = 0;
        if (i >= u[u.length - a.ENTRIES]) d = u[u.length + a.PREV_X], p = u[u.length + a.PREV_Y];
        else {
          var f = e.binarySearch(u, i, a.ENTRIES);
          d = u[f + a.PREV_X], p = u[f + a.PREV_Y];
          var v = u[f],
            M = this.getCurvePercent(f / a.ENTRIES - 1, 1 - (i - v) / (u[f + a.PREV_TIME] - v));
          d += (u[f + a.X] - d) * M, p += (u[f + a.Y] - p) * M
        }
        h == r.setup ? (c.x = c.data.x + d * s, c.y = c.data.y + p * s) : (c.x += (c.data.x + d - c.x) * s, c.y += (c.data.y + p - c.y) * s)
      }
    }, a.ENTRIES = 3, a.PREV_TIME = -3, a.PREV_X = -2, a.PREV_Y = -1, a.X = 1, a.Y = 2, a
  }(a);
  t.TranslateTimeline = s;
  var h = function (a) {
    function o(t) {
      return a.call(this, t) || this
    }
    return __extends(o, a), o.prototype.getPropertyId = function () {
      return (i.scale << 24) + this.boneIndex
    }, o.prototype.apply = function (i, a, s, h, l, u, c) {
      var d = this.frames,
        p = i.bones[this.boneIndex];
      if (s < d[0]) switch (u) {
        case r.setup:
          return p.scaleX = p.data.scaleX, void(p.scaleY = p.data.scaleY);
        case r.current:
          p.scaleX += (p.data.scaleX - p.scaleX) * l, p.scaleY += (p.data.scaleY - p.scaleY) * l
      } else {
        var f = 0,
          v = 0;
        if (s >= d[d.length - o.ENTRIES]) f = d[d.length + o.PREV_X] * p.data.scaleX, v = d[d.length + o.PREV_Y] * p.data.scaleY;
        else {
          var M = e.binarySearch(d, s, o.ENTRIES);
          f = d[M + o.PREV_X], v = d[M + o.PREV_Y];
          var g = d[M],
            m = this.getCurvePercent(M / o.ENTRIES - 1, 1 - (s - g) / (d[M + o.PREV_TIME] - g));
          f = (f + (d[M + o.X] - f) * m) * p.data.scaleX, v = (v + (d[M + o.Y] - v) * m) * p.data.scaleY
        }
        if (1 == l) p.scaleX = f, p.scaleY = v;
        else {
          var y = 0,
            x = 0;
          u == r.setup ? (y = p.data.scaleX, x = p.data.scaleY) : (y = p.scaleX, x = p.scaleY), c == n.out ? (f = Math.abs(f) * t.MathUtils.signum(y), v = Math.abs(v) * t.MathUtils.signum(x)) : (y = Math.abs(y) * t.MathUtils.signum(f), x = Math.abs(x) * t.MathUtils.signum(v)), p.scaleX = y + (f - y) * l, p.scaleY = x + (v - x) * l
        }
      }
    }, o
  }(s);
  t.ScaleTimeline = h;
  var l = function (t) {
    function n(e) {
      return t.call(this, e) || this
    }
    return __extends(n, t), n.prototype.getPropertyId = function () {
      return (i.shear << 24) + this.boneIndex
    }, n.prototype.apply = function (t, i, a, o, s, h, l) {
      var u = this.frames,
        c = t.bones[this.boneIndex];
      if (a < u[0]) switch (h) {
        case r.setup:
          return c.shearX = c.data.shearX, void(c.shearY = c.data.shearY);
        case r.current:
          c.shearX += (c.data.shearX - c.shearX) * s, c.shearY += (c.data.shearY - c.shearY) * s
      } else {
        var d = 0,
          p = 0;
        if (a >= u[u.length - n.ENTRIES]) d = u[u.length + n.PREV_X], p = u[u.length + n.PREV_Y];
        else {
          var f = e.binarySearch(u, a, n.ENTRIES);
          d = u[f + n.PREV_X], p = u[f + n.PREV_Y];
          var v = u[f],
            M = this.getCurvePercent(f / n.ENTRIES - 1, 1 - (a - v) / (u[f + n.PREV_TIME] - v));
          d += (u[f + n.X] - d) * M, p += (u[f + n.Y] - p) * M
        }
        h == r.setup ? (c.shearX = c.data.shearX + d * s, c.shearY = c.data.shearY + p * s) : (c.shearX += (c.data.shearX + d - c.shearX) * s, c.shearY += (c.data.shearY + p - c.shearY) * s)
      }
    }, n
  }(s);
  t.ShearTimeline = l;
  var u = function (n) {
    function a(e) {
      var r = n.call(this, e) || this;
      return r.frames = t.Utils.newFloatArray(e * a.ENTRIES), r
    }
    return __extends(a, n), a.prototype.getPropertyId = function () {
      return (i.color << 24) + this.slotIndex
    }, a.prototype.setFrame = function (t, e, r, n, i, o) {
      t *= a.ENTRIES, this.frames[t] = e, this.frames[t + a.R] = r, this.frames[t + a.G] = n, this.frames[t + a.B] = i, this.frames[t + a.A] = o
    }, a.prototype.apply = function (t, n, i, o, s, h, l) {
      var u = t.slots[this.slotIndex],
        c = this.frames;
      if (i < c[0]) switch (h) {
        case r.setup:
          return void u.color.setFromColor(u.data.color);
        case r.current:
          var d = u.color,
            p = u.data.color;
          d.add((p.r - d.r) * s, (p.g - d.g) * s, (p.b - d.b) * s, (p.a - d.a) * s)
      } else {
        var f = 0,
          v = 0,
          M = 0,
          g = 0;
        if (i >= c[c.length - a.ENTRIES]) {
          var m = c.length;
          f = c[m + a.PREV_R], v = c[m + a.PREV_G], M = c[m + a.PREV_B], g = c[m + a.PREV_A]
        } else {
          var y = e.binarySearch(c, i, a.ENTRIES);
          f = c[y + a.PREV_R], v = c[y + a.PREV_G], M = c[y + a.PREV_B], g = c[y + a.PREV_A];
          var x = c[y],
            w = this.getCurvePercent(y / a.ENTRIES - 1, 1 - (i - x) / (c[y + a.PREV_TIME] - x));
          f += (c[y + a.R] - f) * w, v += (c[y + a.G] - v) * w, M += (c[y + a.B] - M) * w, g += (c[y + a.A] - g) * w
        }
        if (1 == s) u.color.set(f, v, M, g);
        else {
          var d = u.color;
          h == r.setup && d.setFromColor(u.data.color), d.add((f - d.r) * s, (v - d.g) * s, (M - d.b) * s, (g - d.a) * s)
        }
      }
    }, a.ENTRIES = 5, a.PREV_TIME = -5, a.PREV_R = -4, a.PREV_G = -3, a.PREV_B = -2, a.PREV_A = -1, a.R = 1, a.G = 2, a.B = 3, a.A = 4, a
  }(a);
  t.ColorTimeline = u;
  var c = function (n) {
    function a(e) {
      var r = n.call(this, e) || this;
      return r.frames = t.Utils.newFloatArray(e * a.ENTRIES), r
    }
    return __extends(a, n), a.prototype.getPropertyId = function () {
      return (i.twoColor << 24) + this.slotIndex
    }, a.prototype.setFrame = function (t, e, r, n, i, o, s, h, l) {
      t *= a.ENTRIES, this.frames[t] = e, this.frames[t + a.R] = r, this.frames[t + a.G] = n, this.frames[t + a.B] = i, this.frames[t + a.A] = o, this.frames[t + a.R2] = s, this.frames[t + a.G2] = h, this.frames[t + a.B2] = l
    }, a.prototype.apply = function (t, n, i, o, s, h, l) {
      var u = t.slots[this.slotIndex],
        c = this.frames;
      if (i < c[0]) switch (h) {
        case r.setup:
          return u.color.setFromColor(u.data.color), void u.darkColor.setFromColor(u.data.darkColor);
        case r.current:
          var d = u.color,
            p = u.darkColor,
            f = u.data.color,
            v = u.data.darkColor;
          d.add((f.r - d.r) * s, (f.g - d.g) * s, (f.b - d.b) * s, (f.a - d.a) * s), p.add((v.r - p.r) * s, (v.g - p.g) * s, (v.b - p.b) * s, 0)
      } else {
        var M = 0,
          g = 0,
          m = 0,
          y = 0,
          x = 0,
          w = 0,
          A = 0;
        if (i >= c[c.length - a.ENTRIES]) {
          var T = c.length;
          M = c[T + a.PREV_R], g = c[T + a.PREV_G], m = c[T + a.PREV_B], y = c[T + a.PREV_A], x = c[T + a.PREV_R2], w = c[T + a.PREV_G2], A = c[T + a.PREV_B2]
        } else {
          var E = e.binarySearch(c, i, a.ENTRIES);
          M = c[E + a.PREV_R], g = c[E + a.PREV_G], m = c[E + a.PREV_B], y = c[E + a.PREV_A], x = c[E + a.PREV_R2], w = c[E + a.PREV_G2], A = c[E + a.PREV_B2];
          var b = c[E],
            C = this.getCurvePercent(E / a.ENTRIES - 1, 1 - (i - b) / (c[E + a.PREV_TIME] - b));
          M += (c[E + a.R] - M) * C, g += (c[E + a.G] - g) * C, m += (c[E + a.B] - m) * C, y += (c[E + a.A] - y) * C, x += (c[E + a.R2] - x) * C, w += (c[E + a.G2] - w) * C, A += (c[E + a.B2] - A) * C
        }
        if (1 == s) u.color.set(M, g, m, y), u.darkColor.set(x, w, A, 1);
        else {
          var d = u.color,
            p = u.darkColor;
          h == r.setup && (d.setFromColor(u.data.color), p.setFromColor(u.data.darkColor)), d.add((M - d.r) * s, (g - d.g) * s, (m - d.b) * s, (y - d.a) * s), p.add((x - p.r) * s, (w - p.g) * s, (A - p.b) * s, 0)
        }
      }
    }, a.ENTRIES = 8, a.PREV_TIME = -8, a.PREV_R = -7, a.PREV_G = -6, a.PREV_B = -5, a.PREV_A = -4, a.PREV_R2 = -3, a.PREV_G2 = -2, a.PREV_B2 = -1, a.R = 1, a.G = 2, a.B = 3, a.A = 4, a.R2 = 5, a.G2 = 6, a.B2 = 7, a
  }(a);
  t.TwoColorTimeline = c;
  var d = function () {
    function a(e) {
      this.frames = t.Utils.newFloatArray(e), this.attachmentNames = new Array(e)
    }
    return a.prototype.getPropertyId = function () {
      return (i.attachment << 24) + this.slotIndex
    }, a.prototype.getFrameCount = function () {
      return this.frames.length
    }, a.prototype.setFrame = function (t, e, r) {
      this.frames[t] = e, this.attachmentNames[t] = r
    }, a.prototype.apply = function (t, i, a, o, s, h, l) {
      var u = t.slots[this.slotIndex];
      if (l == n.out && h == r.setup) {
        var c = u.data.attachmentName;
        return void u.setAttachment(null == c ? null : t.getAttachment(this.slotIndex, c))
      }
      var d = this.frames;
      if (a < d[0]) {
        if (h == r.setup) {
          var p = u.data.attachmentName;
          u.setAttachment(null == p ? null : t.getAttachment(this.slotIndex, p))
        }
      } else {
        var f = 0;
        f = a >= d[d.length - 1] ? d.length - 1 : e.binarySearch(d, a, 1) - 1;
        var v = this.attachmentNames[f];
        t.slots[this.slotIndex].setAttachment(null == v ? null : t.getAttachment(this.slotIndex, v))
      }
    }, a
  }();
  t.AttachmentTimeline = d;
  var p = null,
    f = function (n) {
      function a(e) {
        var r = n.call(this, e) || this;
        return r.frames = t.Utils.newFloatArray(e), r.frameVertices = new Array(e), null == p && (p = t.Utils.newFloatArray(64)), r
      }
      return __extends(a, n), a.prototype.getPropertyId = function () {
        return (i.deform << 27) + +this.attachment.id + this.slotIndex
      }, a.prototype.setFrame = function (t, e, r) {
        this.frames[t] = e, this.frameVertices[t] = r
      }, a.prototype.apply = function (n, i, a, o, s, h, l) {
        var u = n.slots[this.slotIndex],
          c = u.getAttachment();
        if (c instanceof t.VertexAttachment && c.applyDeform(this.attachment)) {
          var d = u.attachmentVertices;
          0 == d.length && (s = 1);
          var p = this.frameVertices,
            f = p[0].length,
            v = this.frames;
          if (a < v[0]) {
            var M = c;
            switch (h) {
              case r.setup:
                return void(d.length = 0);
              case r.current:
                if (1 == s) {
                  d.length = 0;
                  break
                }
                var g = t.Utils.setArraySize(d, f);
                if (null == M.bones)
                  for (var m = M.vertices, y = 0; y < f; y++) g[y] += (m[y] - g[y]) * s;
                else {
                  s = 1 - s;
                  for (var y = 0; y < f; y++) g[y] *= s
                }
            }
          } else {
            var x = t.Utils.setArraySize(d, f);
            if (a >= v[v.length - 1]) {
              var w = p[v.length - 1];
              if (1 == s) t.Utils.arrayCopy(w, 0, x, 0, f);
              else if (h == r.setup) {
                var M = c;
                if (null == M.bones)
                  for (var A = M.vertices, T = 0; T < f; T++) {
                    var E = A[T];
                    x[T] = E + (w[T] - E) * s
                  } else
                    for (var b = 0; b < f; b++) x[b] = w[b] * s
              } else
                for (var C = 0; C < f; C++) x[C] += (w[C] - x[C]) * s
            } else {
              var R = e.binarySearch(v, a),
                I = p[R - 1],
                S = p[R],
                P = v[R],
                V = this.getCurvePercent(R - 1, 1 - (a - P) / (v[R - 1] - P));
              if (1 == s)
                for (var F = 0; F < f; F++) {
                  var L = I[F];
                  x[F] = L + (S[F] - L) * V
                } else if (h == r.setup) {
                  var M = c;
                  if (null == M.bones)
                    for (var _ = M.vertices, k = 0; k < f; k++) {
                      var L = I[k],
                        E = _[k];
                      x[k] = E + (L + (S[k] - L) * V - E) * s
                    } else
                      for (var N = 0; N < f; N++) {
                        var L = I[N];
                        x[N] = (L + (S[N] - L) * V) * s
                      }
                } else
                  for (var D = 0; D < f; D++) {
                    var L = I[D];
                    x[D] += (L + (S[D] - L) * V - x[D]) * s
                  }
            }
          }
        }
      }, a
    }(a);
  t.DeformTimeline = f;
  var v = function () {
    function r(e) {
      this.frames = t.Utils.newFloatArray(e), this.events = new Array(e)
    }
    return r.prototype.getPropertyId = function () {
      return i.event << 24
    }, r.prototype.getFrameCount = function () {
      return this.frames.length
    }, r.prototype.setFrame = function (t, e) {
      this.frames[t] = e.time, this.events[t] = e
    }, r.prototype.apply = function (t, r, n, i, a, o, s) {
      if (null != i) {
        var h = this.frames,
          l = this.frames.length;
        if (r > n) this.apply(t, r, Number.MAX_VALUE, i, a, o, s), r = -1;
        else if (r >= h[l - 1]) return;
        if (!(n < h[0])) {
          var u = 0;
          if (r < h[0]) u = 0;
          else {
            u = e.binarySearch(h, r);
            for (var c = h[u]; u > 0 && h[u - 1] == c;) u--
          }
          for (; u < l && n >= h[u]; u++) i.push(this.events[u])
        }
      }
    }, r
  }();
  t.EventTimeline = v;
  var M = function () {
    function a(e) {
      this.frames = t.Utils.newFloatArray(e), this.drawOrders = new Array(e)
    }
    return a.prototype.getPropertyId = function () {
      return i.drawOrder << 24
    }, a.prototype.getFrameCount = function () {
      return this.frames.length
    }, a.prototype.setFrame = function (t, e, r) {
      this.frames[t] = e, this.drawOrders[t] = r
    }, a.prototype.apply = function (i, a, o, s, h, l, u) {
      var c = i.drawOrder,
        d = i.slots;
      if (u == n.out && l == r.setup) return void t.Utils.arrayCopy(i.slots, 0, i.drawOrder, 0, i.slots.length);
      var p = this.frames;
      if (o < p[0]) return void(l == r.setup && t.Utils.arrayCopy(i.slots, 0, i.drawOrder, 0, i.slots.length));
      var f = 0;
      f = o >= p[p.length - 1] ? p.length - 1 : e.binarySearch(p, o) - 1;
      var v = this.drawOrders[f];
      if (null == v) t.Utils.arrayCopy(d, 0, c, 0, d.length);
      else
        for (var M = 0, g = v.length; M < g; M++) c[M] = d[v[M]]
    }, a
  }();
  t.DrawOrderTimeline = M;
  var g = function (a) {
    function o(e) {
      var r = a.call(this, e) || this;
      return r.frames = t.Utils.newFloatArray(e * o.ENTRIES), r
    }
    return __extends(o, a), o.prototype.getPropertyId = function () {
      return (i.ikConstraint << 24) + this.ikConstraintIndex
    }, o.prototype.setFrame = function (t, e, r, n) {
      t *= o.ENTRIES, this.frames[t] = e, this.frames[t + o.MIX] = r, this.frames[t + o.BEND_DIRECTION] = n
    }, o.prototype.apply = function (t, i, a, s, h, l, u) {
      var c = this.frames,
        d = t.ikConstraints[this.ikConstraintIndex];
      if (a < c[0]) switch (l) {
        case r.setup:
          return d.mix = d.data.mix, void(d.bendDirection = d.data.bendDirection);
        case r.current:
          d.mix += (d.data.mix - d.mix) * h, d.bendDirection = d.data.bendDirection
      } else {
        if (a >= c[c.length - o.ENTRIES]) return void(l == r.setup ? (d.mix = d.data.mix + (c[c.length + o.PREV_MIX] - d.data.mix) * h, d.bendDirection = u == n.out ? d.data.bendDirection : c[c.length + o.PREV_BEND_DIRECTION]) : (d.mix += (c[c.length + o.PREV_MIX] - d.mix) * h, u == n.in && (d.bendDirection = c[c.length + o.PREV_BEND_DIRECTION])));
        var p = e.binarySearch(c, a, o.ENTRIES),
          f = c[p + o.PREV_MIX],
          v = c[p],
          M = this.getCurvePercent(p / o.ENTRIES - 1, 1 - (a - v) / (c[p + o.PREV_TIME] - v));
        l == r.setup ? (d.mix = d.data.mix + (f + (c[p + o.MIX] - f) * M - d.data.mix) * h, d.bendDirection = u == n.out ? d.data.bendDirection : c[p + o.PREV_BEND_DIRECTION]) : (d.mix += (f + (c[p + o.MIX] - f) * M - d.mix) * h, u == n.in && (d.bendDirection = c[p + o.PREV_BEND_DIRECTION]))
      }
    }, o.ENTRIES = 3, o.PREV_TIME = -3, o.PREV_MIX = -2, o.PREV_BEND_DIRECTION = -1, o.MIX = 1, o.BEND_DIRECTION = 2, o
  }(a);
  t.IkConstraintTimeline = g;
  var m = function (n) {
    function a(e) {
      var r = n.call(this, e) || this;
      return r.frames = t.Utils.newFloatArray(e * a.ENTRIES), r
    }
    return __extends(a, n), a.prototype.getPropertyId = function () {
      return (i.transformConstraint << 24) + this.transformConstraintIndex
    }, a.prototype.setFrame = function (t, e, r, n, i, o) {
      t *= a.ENTRIES, this.frames[t] = e, this.frames[t + a.ROTATE] = r, this.frames[t + a.TRANSLATE] = n, this.frames[t + a.SCALE] = i, this.frames[t + a.SHEAR] = o
    }, a.prototype.apply = function (t, n, i, o, s, h, l) {
      var u = this.frames,
        c = t.transformConstraints[this.transformConstraintIndex];
      if (i < u[0]) {
        var d = c.data;
        switch (h) {
          case r.setup:
            return c.rotateMix = d.rotateMix, c.translateMix = d.translateMix, c.scaleMix = d.scaleMix, void(c.shearMix = d.shearMix);
          case r.current:
            c.rotateMix += (d.rotateMix - c.rotateMix) * s, c.translateMix += (d.translateMix - c.translateMix) * s, c.scaleMix += (d.scaleMix - c.scaleMix) * s, c.shearMix += (d.shearMix - c.shearMix) * s
        }
      } else {
        var p = 0,
          f = 0,
          v = 0,
          M = 0;
        if (i >= u[u.length - a.ENTRIES]) {
          var g = u.length;
          p = u[g + a.PREV_ROTATE], f = u[g + a.PREV_TRANSLATE], v = u[g + a.PREV_SCALE], M = u[g + a.PREV_SHEAR]
        } else {
          var m = e.binarySearch(u, i, a.ENTRIES);
          p = u[m + a.PREV_ROTATE], f = u[m + a.PREV_TRANSLATE], v = u[m + a.PREV_SCALE], M = u[m + a.PREV_SHEAR];
          var y = u[m],
            x = this.getCurvePercent(m / a.ENTRIES - 1, 1 - (i - y) / (u[m + a.PREV_TIME] - y));
          p += (u[m + a.ROTATE] - p) * x, f += (u[m + a.TRANSLATE] - f) * x, v += (u[m + a.SCALE] - v) * x, M += (u[m + a.SHEAR] - M) * x
        }
        if (h == r.setup) {
          var d = c.data;
          c.rotateMix = d.rotateMix + (p - d.rotateMix) * s, c.translateMix = d.translateMix + (f - d.translateMix) * s, c.scaleMix = d.scaleMix + (v - d.scaleMix) * s, c.shearMix = d.shearMix + (M - d.shearMix) * s
        } else c.rotateMix += (p - c.rotateMix) * s, c.translateMix += (f - c.translateMix) * s, c.scaleMix += (v - c.scaleMix) * s, c.shearMix += (M - c.shearMix) * s
      }
    }, a.ENTRIES = 5, a.PREV_TIME = -5, a.PREV_ROTATE = -4, a.PREV_TRANSLATE = -3, a.PREV_SCALE = -2, a.PREV_SHEAR = -1, a.ROTATE = 1, a.TRANSLATE = 2, a.SCALE = 3, a.SHEAR = 4, a
  }(a);
  t.TransformConstraintTimeline = m;
  var y = function (n) {
    function a(e) {
      var r = n.call(this, e) || this;
      return r.frames = t.Utils.newFloatArray(e * a.ENTRIES), r
    }
    return __extends(a, n), a.prototype.getPropertyId = function () {
      return (i.pathConstraintPosition << 24) + this.pathConstraintIndex
    }, a.prototype.setFrame = function (t, e, r) {
      t *= a.ENTRIES, this.frames[t] = e, this.frames[t + a.VALUE] = r
    }, a.prototype.apply = function (t, n, i, o, s, h, l) {
      var u = this.frames,
        c = t.pathConstraints[this.pathConstraintIndex];
      if (i < u[0]) switch (h) {
        case r.setup:
          return void(c.position = c.data.position);
        case r.current:
          c.position += (c.data.position - c.position) * s
      } else {
        var d = 0;
        if (i >= u[u.length - a.ENTRIES]) d = u[u.length + a.PREV_VALUE];
        else {
          var p = e.binarySearch(u, i, a.ENTRIES);
          d = u[p + a.PREV_VALUE];
          var f = u[p],
            v = this.getCurvePercent(p / a.ENTRIES - 1, 1 - (i - f) / (u[p + a.PREV_TIME] - f));
          d += (u[p + a.VALUE] - d) * v
        }
        h == r.setup ? c.position = c.data.position + (d - c.data.position) * s : c.position += (d - c.position) * s
      }
    }, a.ENTRIES = 2, a.PREV_TIME = -2, a.PREV_VALUE = -1, a.VALUE = 1, a
  }(a);
  t.PathConstraintPositionTimeline = y;
  var x = function (t) {
    function n(e) {
      return t.call(this, e) || this
    }
    return __extends(n, t), n.prototype.getPropertyId = function () {
      return (i.pathConstraintSpacing << 24) + this.pathConstraintIndex
    }, n.prototype.apply = function (t, i, a, o, s, h, l) {
      var u = this.frames,
        c = t.pathConstraints[this.pathConstraintIndex];
      if (a < u[0]) switch (h) {
        case r.setup:
          return void(c.spacing = c.data.spacing);
        case r.current:
          c.spacing += (c.data.spacing - c.spacing) * s
      } else {
        var d = 0;
        if (a >= u[u.length - n.ENTRIES]) d = u[u.length + n.PREV_VALUE];
        else {
          var p = e.binarySearch(u, a, n.ENTRIES);
          d = u[p + n.PREV_VALUE];
          var f = u[p],
            v = this.getCurvePercent(p / n.ENTRIES - 1, 1 - (a - f) / (u[p + n.PREV_TIME] - f));
          d += (u[p + n.VALUE] - d) * v
        }
        h == r.setup ? c.spacing = c.data.spacing + (d - c.data.spacing) * s : c.spacing += (d - c.spacing) * s
      }
    }, n
  }(y);
  t.PathConstraintSpacingTimeline = x;
  var w = function (n) {
    function a(e) {
      var r = n.call(this, e) || this;
      return r.frames = t.Utils.newFloatArray(e * a.ENTRIES), r
    }
    return __extends(a, n), a.prototype.getPropertyId = function () {
      return (i.pathConstraintMix << 24) + this.pathConstraintIndex
    }, a.prototype.setFrame = function (t, e, r, n) {
      t *= a.ENTRIES, this.frames[t] = e, this.frames[t + a.ROTATE] = r, this.frames[t + a.TRANSLATE] = n
    }, a.prototype.apply = function (t, n, i, o, s, h, l) {
      var u = this.frames,
        c = t.pathConstraints[this.pathConstraintIndex];
      if (i < u[0]) switch (h) {
        case r.setup:
          return c.rotateMix = c.data.rotateMix, void(c.translateMix = c.data.translateMix);
        case r.current:
          c.rotateMix += (c.data.rotateMix - c.rotateMix) * s, c.translateMix += (c.data.translateMix - c.translateMix) * s
      } else {
        var d = 0,
          p = 0;
        if (i >= u[u.length - a.ENTRIES]) d = u[u.length + a.PREV_ROTATE], p = u[u.length + a.PREV_TRANSLATE];
        else {
          var f = e.binarySearch(u, i, a.ENTRIES);
          d = u[f + a.PREV_ROTATE], p = u[f + a.PREV_TRANSLATE];
          var v = u[f],
            M = this.getCurvePercent(f / a.ENTRIES - 1, 1 - (i - v) / (u[f + a.PREV_TIME] - v));
          d += (u[f + a.ROTATE] - d) * M, p += (u[f + a.TRANSLATE] - p) * M
        }
        h == r.setup ? (c.rotateMix = c.data.rotateMix + (d - c.data.rotateMix) * s, c.translateMix = c.data.translateMix + (p - c.data.translateMix) * s) : (c.rotateMix += (d - c.rotateMix) * s, c.translateMix += (p - c.translateMix) * s)
      }
    }, a.ENTRIES = 3, a.PREV_TIME = -3, a.PREV_ROTATE = -2, a.PREV_TRANSLATE = -1, a.ROTATE = 1, a.TRANSLATE = 2, a
  }(a);
  t.PathConstraintMixTimeline = w
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(e) {
      this.tracks = new Array, this.events = new Array, this.listeners = new Array, this.queue = new n(this), this.propertyIDs = new t.IntSet, this.mixingTo = new Array, this.animationsChanged = !1, this.timeScale = 1, this.trackEntryPool = new t.Pool(function () {
        return new r
      }), this.data = e
    }
    return e.prototype.update = function (t) {
      t *= this.timeScale;
      for (var e = this.tracks, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (null != i) {
          i.animationLast = i.nextAnimationLast, i.trackLast = i.nextTrackLast;
          var a = t * i.timeScale;
          if (i.delay > 0) {
            if (i.delay -= a, i.delay > 0) continue;
            a = -i.delay, i.delay = 0
          }
          var o = i.next;
          if (null != o) {
            var s = i.trackLast - o.delay;
            if (s >= 0) {
              for (o.delay = 0, o.trackTime = s + t * o.timeScale, i.trackTime += a, this.setCurrent(r, o, !0); null != o.mixingFrom;) o.mixTime += a, o = o.mixingFrom;
              continue
            }
          } else if (i.trackLast >= i.trackEnd && null == i.mixingFrom) {
            e[r] = null, this.queue.end(i), this.disposeNext(i);
            continue
          }
          if (null != i.mixingFrom && this.updateMixingFrom(i, t)) {
            var h = i.mixingFrom;
            for (i.mixingFrom = null; null != h;) this.queue.end(h), h = h.mixingFrom
          }
          i.trackTime += a
        }
      }
      this.queue.drain()
    }, e.prototype.updateMixingFrom = function (t, e) {
      var r = t.mixingFrom;
      if (null == r) return !0;
      var n = this.updateMixingFrom(r, e);
      return r.animationLast = r.nextAnimationLast, r.trackLast = r.nextTrackLast, t.mixTime > 0 && (t.mixTime >= t.mixDuration || 0 == t.timeScale) ? (0 != r.totalAlpha && 0 != t.mixDuration || (t.mixingFrom = r.mixingFrom, t.interruptAlpha = r.interruptAlpha, this.queue.end(r)), n) : (r.trackTime += e * r.timeScale, t.mixTime += e * t.timeScale, !1)
    }, e.prototype.apply = function (r) {
      if (null == r) throw new Error("skeleton cannot be null.");
      this.animationsChanged && this._animationsChanged();
      for (var n = this.events, i = this.tracks, a = !1, o = 0, s = i.length; o < s; o++) {
        var h = i[o];
        if (!(null == h || h.delay > 0)) {
          a = !0;
          var l = 0 == o ? t.MixPose.current : t.MixPose.currentLayered,
            u = h.alpha;
          null != h.mixingFrom ? u *= this.applyMixingFrom(h, r, l) : h.trackTime >= h.trackEnd && null == h.next && (u = 0);
          var c = h.animationLast,
            d = h.getAnimationTime(),
            p = h.animation.timelines.length,
            f = h.animation.timelines;
          if (1 == u)
            for (var v = 0; v < p; v++) f[v].apply(r, c, d, n, 1, t.MixPose.setup, t.MixDirection.in);
          else {
            var M = h.timelineData,
              g = 0 == h.timelinesRotation.length;
            g && t.Utils.setArraySize(h.timelinesRotation, p << 1, null);
            for (var m = h.timelinesRotation, v = 0; v < p; v++) {
              var y = f[v],
                x = M[v] >= e.FIRST ? t.MixPose.setup : l;
              y instanceof t.RotateTimeline ? this.applyRotateTimeline(y, r, d, u, x, m, v << 1, g) : (t.Utils.webkit602BugfixHelper(u, x), y.apply(r, c, d, n, u, x, t.MixDirection.in))
            }
          }
          this.queueEvents(h, d), n.length = 0, h.nextAnimationLast = d, h.nextTrackLast = h.trackTime
        }
      }
      return this.queue.drain(), a
    }, e.prototype.applyMixingFrom = function (r, n, i) {
      var a = r.mixingFrom;
      null != a.mixingFrom && this.applyMixingFrom(a, n, i);
      var o = 0;
      0 == r.mixDuration ? (o = 1, i = t.MixPose.setup) : (o = r.mixTime / r.mixDuration, o > 1 && (o = 1));
      var s = o < a.eventThreshold ? this.events : null,
        h = o < a.attachmentThreshold,
        l = o < a.drawOrderThreshold,
        u = a.animationLast,
        c = a.getAnimationTime(),
        d = a.animation.timelines.length,
        p = a.animation.timelines,
        f = a.timelineData,
        v = a.timelineDipMix,
        M = 0 == a.timelinesRotation.length;
      M && t.Utils.setArraySize(a.timelinesRotation, d << 1, null);
      var g, m = a.timelinesRotation,
        y = a.alpha * r.interruptAlpha,
        x = y * (1 - o),
        w = 0;
      a.totalAlpha = 0;
      for (var A = 0; A < d; A++) {
        var T = p[A];
        switch (f[A]) {
          case e.SUBSEQUENT:
            if (!h && T instanceof t.AttachmentTimeline) continue;
            if (!l && T instanceof t.DrawOrderTimeline) continue;
            g = i, w = x;
            break;
          case e.FIRST:
            g = t.MixPose.setup, w = x;
            break;
          case e.DIP:
            g = t.MixPose.setup, w = y;
            break;
          default:
            g = t.MixPose.setup, w = y;
            var E = v[A];
            w *= Math.max(0, 1 - E.mixTime / E.mixDuration)
        }
        a.totalAlpha += w, T instanceof t.RotateTimeline ? this.applyRotateTimeline(T, n, c, w, g, m, A << 1, M) : (t.Utils.webkit602BugfixHelper(w, g), T.apply(n, u, c, s, w, g, t.MixDirection.out))
      }
      return r.mixDuration > 0 && this.queueEvents(a, c), this.events.length = 0, a.nextAnimationLast = c, a.nextTrackLast = a.trackTime, o
    }, e.prototype.applyRotateTimeline = function (e, r, n, i, a, o, s, h) {
      if (h && (o[s] = 0), 1 == i) return void e.apply(r, 0, n, null, 1, a, t.MixDirection.in);
      var l = e,
        u = l.frames,
        c = r.bones[l.boneIndex];
      if (n < u[0]) return void(a == t.MixPose.setup && (c.rotation = c.data.rotation));
      var d = 0;
      if (n >= u[u.length - t.RotateTimeline.ENTRIES]) d = c.data.rotation + u[u.length + t.RotateTimeline.PREV_ROTATION];
      else {
        var p = t.Animation.binarySearch(u, n, t.RotateTimeline.ENTRIES),
          f = u[p + t.RotateTimeline.PREV_ROTATION],
          v = u[p],
          M = l.getCurvePercent((p >> 1) - 1, 1 - (n - v) / (u[p + t.RotateTimeline.PREV_TIME] - v));
        d = u[p + t.RotateTimeline.ROTATION] - f, d -= 360 * (16384 - (16384.499999999996 - d / 360 | 0)), d = f + d * M + c.data.rotation, d -= 360 * (16384 - (16384.499999999996 - d / 360 | 0))
      }
      var g = a == t.MixPose.setup ? c.data.rotation : c.rotation,
        m = 0,
        y = d - g;
      if (0 == y) m = o[s];
      else {
        y -= 360 * (16384 - (16384.499999999996 - y / 360 | 0));
        var x = 0,
          w = 0;
        h ? (x = 0, w = y) : (x = o[s], w = o[s + 1]);
        var A = y > 0,
          T = x >= 0;
        t.MathUtils.signum(w) != t.MathUtils.signum(y) && Math.abs(w) <= 90 && (Math.abs(x) > 180 && (x += 360 * t.MathUtils.signum(x)), T = A), m = y + x - x % 360, T != A && (m += 360 * t.MathUtils.signum(x)), o[s] = m
      }
      o[s + 1] = y, g += m * i, c.rotation = g - 360 * (16384 - (16384.499999999996 - g / 360 | 0))
    }, e.prototype.queueEvents = function (t, e) {
      for (var r = t.animationStart, n = t.animationEnd, i = n - r, a = t.trackLast % i, o = this.events, s = 0, h = o.length; s < h; s++) {
        var l = o[s];
        if (l.time < a) break;
        l.time > n || this.queue.event(t, l)
      }
      var u = !1;
      for (u = t.loop ? 0 == i || a > t.trackTime % i : e >= n && t.animationLast < n, u && this.queue.complete(t); s < h; s++) {
        var c = o[s];
        c.time < r || this.queue.event(t, o[s])
      }
    }, e.prototype.clearTracks = function () {
      var t = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var e = 0, r = this.tracks.length; e < r; e++) this.clearTrack(e);
      this.tracks.length = 0, this.queue.drainDisabled = t, this.queue.drain()
    }, e.prototype.clearTrack = function (t) {
      if (!(t >= this.tracks.length)) {
        var e = this.tracks[t];
        if (null != e) {
          this.queue.end(e), this.disposeNext(e);
          for (var r = e;;) {
            var n = r.mixingFrom;
            if (null == n) break;
            this.queue.end(n), r.mixingFrom = null, r = n
          }
          this.tracks[e.trackIndex] = null, this.queue.drain()
        }
      }
    }, e.prototype.setCurrent = function (t, e, r) {
      var n = this.expandToIndex(t);
      this.tracks[t] = e, null != n && (r && this.queue.interrupt(n), e.mixingFrom = n, e.mixTime = 0, null != n.mixingFrom && n.mixDuration > 0 && (e.interruptAlpha *= Math.min(1, n.mixTime / n.mixDuration)), n.timelinesRotation.length = 0), this.queue.start(e)
    }, e.prototype.setAnimation = function (t, e, r) {
      var n = this.data.skeletonData.findAnimation(e);
      if (null == n) throw new Error("Animation not found: " + e);
      return this.setAnimationWith(t, n, r)
    }, e.prototype.setAnimationWith = function (t, e, r) {
      if (null == e) throw new Error("animation cannot be null.");
      var n = !0,
        i = this.expandToIndex(t);
      null != i && (i.nextTrackLast == -1 ? (this.tracks[t] = i.mixingFrom, this.queue.interrupt(i), this.queue.end(i), this.disposeNext(i), i = i.mixingFrom, n = !1) : this.disposeNext(i));
      var a = this.trackEntry(t, e, r, i);
      return this.setCurrent(t, a, n), this.queue.drain(), a
    }, e.prototype.addAnimation = function (t, e, r, n) {
      var i = this.data.skeletonData.findAnimation(e);
      if (null == i) throw new Error("Animation not found: " + e);
      return this.addAnimationWith(t, i, r, n)
    }, e.prototype.addAnimationWith = function (t, e, r, n) {
      if (null == e) throw new Error("animation cannot be null.");
      var i = this.expandToIndex(t);
      if (null != i)
        for (; null != i.next;) i = i.next;
      var a = this.trackEntry(t, e, r, i);
      if (null == i) this.setCurrent(t, a, !0), this.queue.drain();
      else if (i.next = a, n <= 0) {
        var o = i.animationEnd - i.animationStart;
        0 != o ? (n += i.loop ? o * (1 + (i.trackTime / o | 0)) : o, n -= this.data.getMix(i.animation, e)) : n = 0
      }
      return a.delay = n, a
    }, e.prototype.setEmptyAnimation = function (t, r) {
      var n = this.setAnimationWith(t, e.emptyAnimation, !1);
      return n.mixDuration = r, n.trackEnd = r, n
    }, e.prototype.addEmptyAnimation = function (t, r, n) {
      n <= 0 && (n -= r);
      var i = this.addAnimationWith(t, e.emptyAnimation, !1, n);
      return i.mixDuration = r, i.trackEnd = r, i
    }, e.prototype.setEmptyAnimations = function (t) {
      var e = this.queue.drainDisabled;
      this.queue.drainDisabled = !0;
      for (var r = 0, n = this.tracks.length; r < n; r++) {
        var i = this.tracks[r];
        null != i && this.setEmptyAnimation(i.trackIndex, t)
      }
      this.queue.drainDisabled = e, this.queue.drain()
    }, e.prototype.expandToIndex = function (e) {
      return e < this.tracks.length ? this.tracks[e] : (t.Utils.ensureArrayCapacity(this.tracks, e - this.tracks.length + 1, null), this.tracks.length = e + 1, null)
    }, e.prototype.trackEntry = function (t, e, r, n) {
      var i = this.trackEntryPool.obtain();
      return i.trackIndex = t, i.animation = e, i.loop = r, i.eventThreshold = 0, i.attachmentThreshold = 0, i.drawOrderThreshold = 0, i.animationStart = 0, i.animationEnd = e.duration, i.animationLast = -1, i.nextAnimationLast = -1, i.delay = 0, i.trackTime = 0, i.trackLast = -1, i.nextTrackLast = -1, i.trackEnd = Number.MAX_VALUE, i.timeScale = 1, i.alpha = 1, i.interruptAlpha = 1, i.mixTime = 0, i.mixDuration = null == n ? 0 : this.data.getMix(n.animation, e), i
    }, e.prototype.disposeNext = function (t) {
      for (var e = t.next; null != e;) this.queue.dispose(e), e = e.next;
      t.next = null
    }, e.prototype._animationsChanged = function () {
      this.animationsChanged = !1;
      var t = this.propertyIDs;
      t.clear();
      for (var e = this.mixingTo, r = 0, n = this.tracks.length; r < n; r++) {
        var i = this.tracks[r];
        null != i && i.setTimelineData(null, e, t)
      }
    }, e.prototype.getCurrent = function (t) {
      return t >= this.tracks.length ? null : this.tracks[t]
    }, e.prototype.addListener = function (t) {
      if (null == t) throw new Error("listener cannot be null.");
      this.listeners.push(t)
    }, e.prototype.removeListener = function (t) {
      var e = this.listeners.indexOf(t);
      e >= 0 && this.listeners.splice(e, 1)
    }, e.prototype.clearListeners = function () {
      this.listeners.length = 0
    }, e.prototype.clearListenerNotifications = function () {
      this.queue.clear()
    }, e.emptyAnimation = new t.Animation("<empty>", [], 0), e.SUBSEQUENT = 0, e.FIRST = 1, e.DIP = 2, e.DIP_MIX = 3, e
  }();
  t.AnimationState = e;
  var r = function () {
    function r() {
      this.timelineData = new Array, this.timelineDipMix = new Array, this.timelinesRotation = new Array
    }
    return r.prototype.reset = function () {
      this.next = null, this.mixingFrom = null, this.animation = null, this.listener = null, this.timelineData.length = 0, this.timelineDipMix.length = 0, this.timelinesRotation.length = 0
    }, r.prototype.setTimelineData = function (r, n, i) {
      null != r && n.push(r);
      var a = null != this.mixingFrom ? this.mixingFrom.setTimelineData(this, n, i) : this;
      null != r && n.pop();
      var o = n,
        s = n.length - 1,
        h = this.animation.timelines,
        l = this.animation.timelines.length,
        u = t.Utils.setArraySize(this.timelineData, l);
      this.timelineDipMix.length = 0;
      var c = t.Utils.setArraySize(this.timelineDipMix, l);
      t: for (var d = 0; d < l; d++) {
        var p = h[d].getPropertyId();
        if (i.add(p))
          if (null != r && r.hasTimeline(p)) {
            for (var f = s; f >= 0; f--) {
              var v = o[f];
              if (!v.hasTimeline(p) && v.mixDuration > 0) {
                u[d] = e.DIP_MIX, c[d] = v;
                continue t
              }
            }
            u[d] = e.DIP
          } else u[d] = e.FIRST;
        else u[d] = e.SUBSEQUENT
      }
      return a
    }, r.prototype.hasTimeline = function (t) {
      for (var e = this.animation.timelines, r = 0, n = e.length; r < n; r++)
        if (e[r].getPropertyId() == t) return !0;
      return !1
    }, r.prototype.getAnimationTime = function () {
      if (this.loop) {
        var t = this.animationEnd - this.animationStart;
        return 0 == t ? this.animationStart : this.trackTime % t + this.animationStart
      }
      return Math.min(this.trackTime + this.animationStart, this.animationEnd)
    }, r.prototype.setAnimationLast = function (t) {
      this.animationLast = t, this.nextAnimationLast = t
    }, r.prototype.isComplete = function () {
      return this.trackTime >= this.animationEnd - this.animationStart
    }, r.prototype.resetRotationDirections = function () {
      this.timelinesRotation.length = 0
    }, r
  }();
  t.TrackEntry = r;
  var n = function () {
    function t(t) {
      this.objects = [], this.drainDisabled = !1, this.animState = t
    }
    return t.prototype.start = function (t) {
      this.objects.push(i.start), this.objects.push(t), this.animState.animationsChanged = !0
    }, t.prototype.interrupt = function (t) {
      this.objects.push(i.interrupt), this.objects.push(t)
    }, t.prototype.end = function (t) {
      this.objects.push(i.end), this.objects.push(t), this.animState.animationsChanged = !0;
    }, t.prototype.dispose = function (t) {
      this.objects.push(i.dispose), this.objects.push(t)
    }, t.prototype.complete = function (t) {
      this.objects.push(i.complete), this.objects.push(t)
    }, t.prototype.event = function (t, e) {
      this.objects.push(i.event), this.objects.push(t), this.objects.push(e)
    }, t.prototype.drain = function () {
      if (!this.drainDisabled) {
        this.drainDisabled = !0;
        for (var t = this.objects, e = this.animState.listeners, r = 0; r < t.length; r += 2) {
          var n = t[r],
            a = t[r + 1];
          switch (n) {
            case i.start:
              null != a.listener && a.listener.start && a.listener.start(a);
              for (var o = 0; o < e.length; o++) e[o].start && e[o].start(a);
              break;
            case i.interrupt:
              null != a.listener && a.listener.interrupt && a.listener.interrupt(a);
              for (var o = 0; o < e.length; o++) e[o].interrupt && e[o].interrupt(a);
              break;
            case i.end:
              null != a.listener && a.listener.end && a.listener.end(a);
              for (var o = 0; o < e.length; o++) e[o].end && e[o].end(a);
            case i.dispose:
              null != a.listener && a.listener.dispose && a.listener.dispose(a);
              for (var o = 0; o < e.length; o++) e[o].dispose && e[o].dispose(a);
              this.animState.trackEntryPool.free(a);
              break;
            case i.complete:
              null != a.listener && a.listener.complete && a.listener.complete(a);
              for (var o = 0; o < e.length; o++) e[o].complete && e[o].complete(a);
              break;
            case i.event:
              var s = t[r++ + 2];
              null != a.listener && a.listener.event && a.listener.event(a, s);
              for (var o = 0; o < e.length; o++) e[o].event && e[o].event(a, s)
          }
        }
        this.clear(), this.drainDisabled = !1
      }
    }, t.prototype.clear = function () {
      this.objects.length = 0
    }, t
  }();
  t.EventQueue = n;
  var i;
  (function (t) {
    t[t.start = 0] = "start", t[t.interrupt = 1] = "interrupt", t[t.end = 2] = "end", t[t.dispose = 3] = "dispose", t[t.complete = 4] = "complete", t[t.event = 5] = "event"
  })(i = t.EventType || (t.EventType = {}));
  var a = function () {
    function t() {}
    return t.prototype.start = function (t) {}, t.prototype.interrupt = function (t) {}, t.prototype.end = function (t) {}, t.prototype.dispose = function (t) {}, t.prototype.complete = function (t) {}, t.prototype.event = function (t, e) {}, t
  }();
  t.AnimationStateAdapter2 = a
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t) {
      if (this.animationToMixTime = {}, this.defaultMix = 0, null == t) throw new Error("skeletonData cannot be null.");
      this.skeletonData = t
    }
    return t.prototype.setMix = function (t, e, r) {
      var n = this.skeletonData.findAnimation(t);
      if (null == n) throw new Error("Animation not found: " + t);
      var i = this.skeletonData.findAnimation(e);
      if (null == i) throw new Error("Animation not found: " + e);
      this.setMixWith(n, i, r)
    }, t.prototype.setMixWith = function (t, e, r) {
      if (null == t) throw new Error("from cannot be null.");
      if (null == e) throw new Error("to cannot be null.");
      var n = t.name + "." + e.name;
      this.animationToMixTime[n] = r
    }, t.prototype.getMix = function (t, e) {
      var r = t.name + "." + e.name,
        n = this.animationToMixTime[r];
      return void 0 === n ? this.defaultMix : n
    }, t
  }();
  t.AnimationStateData = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t, e) {
      void 0 === e && (e = ""), this.assets = {}, this.errors = {}, this.toLoad = 0, this.loaded = 0, this.textureLoader = t, this.pathPrefix = e
    }
    return e.downloadText = function (t, e, r) {
      var n = new XMLHttpRequest;
      n.open("GET", t, !0), n.onload = function () {
        200 == n.status ? e(n.responseText) : r(n.status, n.responseText)
      }, n.onerror = function () {
        r(n.status, n.responseText)
      }, n.send()
    }, e.downloadBinary = function (t, e, r) {
      var n = new XMLHttpRequest;
      n.open("GET", t, !0), n.responseType = "arraybuffer", n.onload = function () {
        200 == n.status ? e(new Uint8Array(n.response)) : r(n.status, n.responseText)
      }, n.onerror = function () {
        r(n.status, n.responseText)
      }, n.send()
    }, e.prototype.loadText = function (t, r, n) {
      var i = this;
      void 0 === r && (r = null), void 0 === n && (n = null), t = this.pathPrefix + t, this.toLoad++, e.downloadText(t, function (e) {
        i.assets[t] = e, r && r(t, e), i.toLoad--, i.loaded++
      }, function (e, r) {
        i.errors[t] = "Couldn't load text " + t + ": status " + status + ", " + r, n && n(t, "Couldn't load text " + t + ": status " + status + ", " + r), i.toLoad--, i.loaded++
      })
    }, e.prototype.loadData = function (t, e, r) {
      var n = this;
      void 0 === e && (e = null), void 0 === r && (r = null), t = this.pathPrefix + t, this.toLoad++;
      var i = new XMLHttpRequest;
      i.onreadystatechange = function () {
        i.readyState == XMLHttpRequest.DONE && (i.status >= 200 && i.status < 300 ? (n.assets[t] = i.response, e && e(t, i.response)) : (n.errors[t] = "Couldn't load text " + t + ": status " + i.status + ", " + i.response, r && r(t, "Couldn't load text " + t + ": status " + i.status + ", " + i.response)), n.toLoad--, n.loaded++)
      }, i.open("GET", t, !0), i.responseType = "arraybuffer", i.send()
    }, e.prototype.loadTexture = function (t, e, r) {
      var n = this;
      void 0 === e && (e = null), void 0 === r && (r = null), t = this.pathPrefix + t, this.toLoad++;
      var i = new Image;
      i.crossOrigin = "anonymous", i.onload = function (r) {
        var a = n.textureLoader(i);
        n.assets[t] = a, n.toLoad--, n.loaded++, e && e(t, i)
      }, i.onerror = function (e) {
        n.errors[t] = "Couldn't load image " + t, n.toLoad--, n.loaded++, r && r(t, "Couldn't load image " + t)
      }, i.src = t
    }, e.prototype.loadTextureData = function (t, e, r, n) {
      var i = this;
      void 0 === r && (r = null), void 0 === n && (n = null), t = this.pathPrefix + t, this.toLoad++;
      var a = new Image;
      a.onload = function (e) {
        var n = i.textureLoader(a);
        i.assets[t] = n, i.toLoad--, i.loaded++, r && r(t, a)
      }, a.onerror = function (e) {
        i.errors[t] = "Couldn't load image " + t, i.toLoad--, i.loaded++, n && n(t, "Couldn't load image " + t)
      }, a.src = e
    }, e.prototype.loadTextureAtlas = function (r, n, i) {
      var a = this;
      void 0 === n && (n = null), void 0 === i && (i = null);
      var o = r.lastIndexOf("/") >= 0 ? r.substring(0, r.lastIndexOf("/")) : "";
      r = this.pathPrefix + r, this.toLoad++, e.downloadText(r, function (e) {
        var s = {
            count: 0
          },
          h = new Array;
        try {
          new t.TextureAtlas(e, function (e) {
            h.push(o + "/" + e);
            var r = document.createElement("img");
            return r.width = 16, r.height = 16, new t.FakeTexture(r)
          })
        } catch (t) {
          var l = t;
          return a.errors[r] = "Couldn't load texture atlas " + r + ": " + l.message, i && i(r, "Couldn't load texture atlas " + r + ": " + l.message), a.toLoad--, void a.loaded++
        }
        for (var u = function (l) {
            var u = !1;
            a.loadTexture(l, function (l, c) {
              if (s.count++, s.count == h.length)
                if (u) a.errors[r] = "Couldn't load texture atlas page " + l + "} of atlas " + r, i && i(r, "Couldn't load texture atlas page " + l + " of atlas " + r), a.toLoad--, a.loaded++;
                else try {
                  var d = new t.TextureAtlas(e, function (t) {
                    return a.get(o + "/" + t)
                  });
                  a.assets[r] = d, n && n(r, d), a.toLoad--, a.loaded++
                } catch (t) {
                  var p = t;
                  a.errors[r] = "Couldn't load texture atlas " + r + ": " + p.message, i && i(r, "Couldn't load texture atlas " + r + ": " + p.message), a.toLoad--, a.loaded++
                }
            }, function (t, e) {
              u = !0, s.count++, s.count == h.length && (a.errors[r] = "Couldn't load texture atlas page " + t + "} of atlas " + r, i && i(r, "Couldn't load texture atlas page " + t + " of atlas " + r), a.toLoad--, a.loaded++)
            })
          }, c = 0, d = h; c < d.length; c++) {
          var p = d[c];
          u(p)
        }
      }, function (t, e) {
        a.errors[r] = "Couldn't load texture atlas " + r + ": status " + status + ", " + e, i && i(r, "Couldn't load texture atlas " + r + ": status " + status + ", " + e), a.toLoad--, a.loaded++
      })
    }, e.prototype.get = function (t) {
      return t = this.pathPrefix + t, this.assets[t]
    }, e.prototype.remove = function (t) {
      t = this.pathPrefix + t;
      var e = this.assets[t];
      e.dispose && e.dispose(), this.assets[t] = null
    }, e.prototype.removeAll = function () {
      for (var t in this.assets) {
        var e = this.assets[t];
        e.dispose && e.dispose()
      }
      this.assets = {}
    }, e.prototype.isLoadingComplete = function () {
      return 0 == this.toLoad
    }, e.prototype.getToLoad = function () {
      return this.toLoad
    }, e.prototype.getLoaded = function () {
      return this.loaded
    }, e.prototype.dispose = function () {
      this.removeAll()
    }, e.prototype.hasErrors = function () {
      return Object.keys(this.errors).length > 0
    }, e.prototype.getErrors = function () {
      return this.errors
    }, e
  }();
  t.AssetManager = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t) {
      this.atlas = t
    }
    return e.prototype.newRegionAttachment = function (e, r, n) {
      var i = this.atlas.findRegion(n);
      if (null == i) throw new Error("Region not found in atlas: " + n + " (region attachment: " + r + ")");
      i.renderObject = i;
      var a = new t.RegionAttachment(r);
      return a.setRegion(i), a
    }, e.prototype.newMeshAttachment = function (e, r, n) {
      var i = this.atlas.findRegion(n);
      if (null == i) throw new Error("Region not found in atlas: " + n + " (mesh attachment: " + r + ")");
      i.renderObject = i;
      var a = new t.MeshAttachment(r);
      return a.region = i, a
    }, e.prototype.newBoundingBoxAttachment = function (e, r) {
      return new t.BoundingBoxAttachment(r)
    }, e.prototype.newPathAttachment = function (e, r) {
      return new t.PathAttachment(r)
    }, e.prototype.newPointAttachment = function (e, r) {
      return new t.PointAttachment(r)
    }, e.prototype.newClippingAttachment = function (e, r) {
      return new t.ClippingAttachment(r)
    }, e
  }();
  t.AtlasAttachmentLoader = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (t) {
    t[t.Normal = 0] = "Normal", t[t.Additive = 1] = "Additive", t[t.Multiply = 2] = "Multiply", t[t.Screen = 3] = "Screen"
  })(e = t.BlendMode || (t.BlendMode = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t, e, r) {
      if (this.children = new Array, this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 0, this.scaleY = 0, this.shearX = 0, this.shearY = 0, this.ax = 0, this.ay = 0, this.arotation = 0, this.ascaleX = 0, this.ascaleY = 0, this.ashearX = 0, this.ashearY = 0, this.appliedValid = !1, this.a = 0, this.b = 0, this.worldX = 0, this.c = 0, this.d = 0, this.worldY = 0, this.sorted = !1, null == t) throw new Error("data cannot be null.");
      if (null == e) throw new Error("skeleton cannot be null.");
      this.data = t, this.skeleton = e, this.parent = r, this.setToSetupPose()
    }
    return e.prototype.update = function () {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY)
    }, e.prototype.updateWorldTransform = function () {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY)
    }, e.prototype.updateWorldTransformWith = function (e, r, n, i, a, o, s) {
      this.ax = e, this.ay = r, this.arotation = n, this.ascaleX = i, this.ascaleY = a, this.ashearX = o, this.ashearY = s, this.appliedValid = !0;
      var h = this.parent;
      if (null == h) {
        var l = n + 90 + s,
          u = t.MathUtils.cosDeg(n + o) * i,
          c = t.MathUtils.cosDeg(l) * a,
          d = t.MathUtils.sinDeg(n + o) * i,
          p = t.MathUtils.sinDeg(l) * a,
          f = this.skeleton;
        return f.flipX && (e = -e, u = -u, c = -c), f.flipY && (r = -r, d = -d, p = -p), this.a = u, this.b = c, this.c = d, this.d = p, this.worldX = e + f.x, void(this.worldY = r + f.y)
      }
      var v = h.a,
        M = h.b,
        g = h.c,
        m = h.d;
      switch (this.worldX = v * e + M * r + h.worldX, this.worldY = g * e + m * r + h.worldY, this.data.transformMode) {
        case t.TransformMode.Normal:
          var l = n + 90 + s,
            u = t.MathUtils.cosDeg(n + o) * i,
            c = t.MathUtils.cosDeg(l) * a,
            d = t.MathUtils.sinDeg(n + o) * i,
            p = t.MathUtils.sinDeg(l) * a;
          return this.a = v * u + M * d, this.b = v * c + M * p, this.c = g * u + m * d, void(this.d = g * c + m * p);
        case t.TransformMode.OnlyTranslation:
          var l = n + 90 + s;
          this.a = t.MathUtils.cosDeg(n + o) * i, this.b = t.MathUtils.cosDeg(l) * a, this.c = t.MathUtils.sinDeg(n + o) * i, this.d = t.MathUtils.sinDeg(l) * a;
          break;
        case t.TransformMode.NoRotationOrReflection:
          var y = v * v + g * g,
            x = 0;
          y > 1e-4 ? (y = Math.abs(v * m - M * g) / y, M = g * y, m = v * y, x = Math.atan2(g, v) * t.MathUtils.radDeg) : (v = 0, g = 0, x = 90 - Math.atan2(m, M) * t.MathUtils.radDeg);
          var w = n + o - x,
            A = n + s - x + 90,
            u = t.MathUtils.cosDeg(w) * i,
            c = t.MathUtils.cosDeg(A) * a,
            d = t.MathUtils.sinDeg(w) * i,
            p = t.MathUtils.sinDeg(A) * a;
          this.a = v * u - M * d, this.b = v * c - M * p, this.c = g * u + m * d, this.d = g * c + m * p;
          break;
        case t.TransformMode.NoScale:
        case t.TransformMode.NoScaleOrReflection:
          var T = t.MathUtils.cosDeg(n),
            E = t.MathUtils.sinDeg(n),
            b = v * T + M * E,
            C = g * T + m * E,
            y = Math.sqrt(b * b + C * C);
          y > 1e-5 && (y = 1 / y), b *= y, C *= y, y = Math.sqrt(b * b + C * C);
          var R = Math.PI / 2 + Math.atan2(C, b),
            I = Math.cos(R) * y,
            S = Math.sin(R) * y,
            u = t.MathUtils.cosDeg(o) * i,
            c = t.MathUtils.cosDeg(90 + s) * a,
            d = t.MathUtils.sinDeg(o) * i,
            p = t.MathUtils.sinDeg(90 + s) * a;
          return (this.data.transformMode != t.TransformMode.NoScaleOrReflection ? v * m - M * g < 0 : this.skeleton.flipX != this.skeleton.flipY) && (I = -I, S = -S), this.a = b * u + I * d, this.b = b * c + I * p, this.c = C * u + S * d, void(this.d = C * c + S * p)
      }
      this.skeleton.flipX && (this.a = -this.a, this.b = -this.b), this.skeleton.flipY && (this.c = -this.c, this.d = -this.d)
    }, e.prototype.setToSetupPose = function () {
      var t = this.data;
      this.x = t.x, this.y = t.y, this.rotation = t.rotation, this.scaleX = t.scaleX, this.scaleY = t.scaleY, this.shearX = t.shearX, this.shearY = t.shearY
    }, e.prototype.getWorldRotationX = function () {
      return Math.atan2(this.c, this.a) * t.MathUtils.radDeg
    }, e.prototype.getWorldRotationY = function () {
      return Math.atan2(this.d, this.b) * t.MathUtils.radDeg
    }, e.prototype.getWorldScaleX = function () {
      return Math.sqrt(this.a * this.a + this.c * this.c)
    }, e.prototype.getWorldScaleY = function () {
      return Math.sqrt(this.b * this.b + this.d * this.d)
    }, e.prototype.updateAppliedTransform = function () {
      this.appliedValid = !0;
      var e = this.parent;
      if (null == e) return this.ax = this.worldX, this.ay = this.worldY, this.arotation = Math.atan2(this.c, this.a) * t.MathUtils.radDeg, this.ascaleX = Math.sqrt(this.a * this.a + this.c * this.c), this.ascaleY = Math.sqrt(this.b * this.b + this.d * this.d), this.ashearX = 0, void(this.ashearY = Math.atan2(this.a * this.b + this.c * this.d, this.a * this.d - this.b * this.c) * t.MathUtils.radDeg);
      var r = e.a,
        n = e.b,
        i = e.c,
        a = e.d,
        o = 1 / (r * a - n * i),
        s = this.worldX - e.worldX,
        h = this.worldY - e.worldY;
      this.ax = s * a * o - h * n * o, this.ay = h * r * o - s * i * o;
      var l = o * a,
        u = o * r,
        c = o * n,
        d = o * i,
        p = l * this.a - c * this.c,
        f = l * this.b - c * this.d,
        v = u * this.c - d * this.a,
        M = u * this.d - d * this.b;
      if (this.ashearX = 0, this.ascaleX = Math.sqrt(p * p + v * v), this.ascaleX > 1e-4) {
        var g = p * M - f * v;
        this.ascaleY = g / this.ascaleX, this.ashearY = Math.atan2(p * f + v * M, g) * t.MathUtils.radDeg, this.arotation = Math.atan2(v, p) * t.MathUtils.radDeg
      } else this.ascaleX = 0, this.ascaleY = Math.sqrt(f * f + M * M), this.ashearY = 0, this.arotation = 90 - Math.atan2(M, f) * t.MathUtils.radDeg
    }, e.prototype.worldToLocal = function (t) {
      var e = this.a,
        r = this.b,
        n = this.c,
        i = this.d,
        a = 1 / (e * i - r * n),
        o = t.x - this.worldX,
        s = t.y - this.worldY;
      return t.x = o * i * a - s * r * a, t.y = s * e * a - o * n * a, t
    }, e.prototype.localToWorld = function (t) {
      var e = t.x,
        r = t.y;
      return t.x = e * this.a + r * this.b + this.worldX, t.y = e * this.c + r * this.d + this.worldY, t
    }, e.prototype.worldToLocalRotation = function (e) {
      var r = t.MathUtils.sinDeg(e),
        n = t.MathUtils.cosDeg(e);
      return Math.atan2(this.a * r - this.c * n, this.d * n - this.b * r) * t.MathUtils.radDeg
    }, e.prototype.localToWorldRotation = function (e) {
      var r = t.MathUtils.sinDeg(e),
        n = t.MathUtils.cosDeg(e);
      return Math.atan2(n * this.c + r * this.d, n * this.a + r * this.b) * t.MathUtils.radDeg
    }, e.prototype.rotateWorld = function (e) {
      var r = this.a,
        n = this.b,
        i = this.c,
        a = this.d,
        o = t.MathUtils.cosDeg(e),
        s = t.MathUtils.sinDeg(e);
      this.a = o * r - s * i, this.b = o * n - s * a, this.c = s * r + o * i, this.d = s * n + o * a, this.appliedValid = !1
    }, e
  }();
  t.Bone = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t, e, n) {
      if (this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 1, this.scaleY = 1, this.shearX = 0, this.shearY = 0, this.transformMode = r.Normal, t < 0) throw new Error("index must be >= 0.");
      if (null == e) throw new Error("name cannot be null.");
      this.index = t, this.name = e, this.parent = n
    }
    return t
  }();
  t.BoneData = e;
  var r;
  (function (t) {
    t[t.Normal = 0] = "Normal", t[t.OnlyTranslation = 1] = "OnlyTranslation", t[t.NoRotationOrReflection = 2] = "NoRotationOrReflection", t[t.NoScale = 3] = "NoScale", t[t.NoScaleOrReflection = 4] = "NoScaleOrReflection"
  })(r = t.TransformMode || (t.TransformMode = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t, e) {
      if (null == e) throw new Error("data cannot be null.");
      this.time = t, this.data = e
    }
    return t
  }();
  t.Event = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t) {
      this.name = t
    }
    return t
  }();
  t.EventData = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t, e) {
      if (this.mix = 1, this.bendDirection = 0, null == t) throw new Error("data cannot be null.");
      if (null == e) throw new Error("skeleton cannot be null.");
      this.data = t, this.mix = t.mix, this.bendDirection = t.bendDirection, this.bones = new Array;
      for (var r = 0; r < t.bones.length; r++) this.bones.push(e.findBone(t.bones[r].name));
      this.target = e.findBone(t.target.name)
    }
    return e.prototype.getOrder = function () {
      return this.data.order
    }, e.prototype.apply = function () {
      this.update()
    }, e.prototype.update = function () {
      var t = this.target,
        e = this.bones;
      switch (e.length) {
        case 1:
          this.apply1(e[0], t.worldX, t.worldY, this.mix);
          break;
        case 2:
          this.apply2(e[0], e[1], t.worldX, t.worldY, this.bendDirection, this.mix)
      }
    }, e.prototype.apply1 = function (e, r, n, i) {
      e.appliedValid || e.updateAppliedTransform();
      var a = e.parent,
        o = 1 / (a.a * a.d - a.b * a.c),
        s = r - a.worldX,
        h = n - a.worldY,
        l = (s * a.d - h * a.b) * o - e.ax,
        u = (h * a.a - s * a.c) * o - e.ay,
        c = Math.atan2(u, l) * t.MathUtils.radDeg - e.ashearX - e.arotation;
      e.ascaleX < 0 && (c += 180), c > 180 ? c -= 360 : c < -180 && (c += 360), e.updateWorldTransformWith(e.ax, e.ay, e.arotation + c * i, e.ascaleX, e.ascaleY, e.ashearX, e.ashearY)
    }, e.prototype.apply2 = function (e, r, n, i, a, o) {
      if (0 == o) return void r.updateWorldTransform();
      e.appliedValid || e.updateAppliedTransform(), r.appliedValid || r.updateAppliedTransform();
      var s = e.ax,
        h = e.ay,
        l = e.ascaleX,
        u = e.ascaleY,
        c = r.ascaleX,
        d = 0,
        p = 0,
        f = 0;
      l < 0 ? (l = -l, d = 180, f = -1) : (d = 0, f = 1), u < 0 && (u = -u, f = -f), c < 0 ? (c = -c, p = 180) : p = 0;
      var v = r.ax,
        M = 0,
        g = 0,
        m = 0,
        y = e.a,
        x = e.b,
        w = e.c,
        A = e.d,
        T = Math.abs(l - u) <= 1e-4;
      T ? (M = r.ay, g = y * v + x * M + e.worldX, m = w * v + A * M + e.worldY) : (M = 0, g = y * v + e.worldX, m = w * v + e.worldY);
      var E = e.parent;
      y = E.a, x = E.b, w = E.c, A = E.d;
      var b = 1 / (y * A - x * w),
        C = n - E.worldX,
        R = i - E.worldY,
        I = (C * A - R * x) * b - s,
        S = (R * y - C * w) * b - h;
      C = g - E.worldX, R = m - E.worldY;
      var P = (C * A - R * x) * b - s,
        V = (R * y - C * w) * b - h,
        F = Math.sqrt(P * P + V * V),
        L = r.data.length * c,
        _ = 0,
        k = 0;
      t: if (T) {
        L *= l;
        var N = (I * I + S * S - F * F - L * L) / (2 * F * L);
        N < -1 ? N = -1 : N > 1 && (N = 1), k = Math.acos(N) * a, y = F + L * N, x = L * Math.sin(k), _ = Math.atan2(S * y - I * x, I * y + S * x)
      } else {
        y = l * L, x = u * L;
        var D = y * y,
          B = x * x,
          U = I * I + S * S,
          O = Math.atan2(S, I);
        w = B * F * F + D * U - D * B;
        var X = -2 * B * F,
          Y = B - D;
        if (A = X * X - 4 * Y * w, A >= 0) {
          var W = Math.sqrt(A);
          X < 0 && (W = -W), W = -(X + W) / 2;
          var G = W / Y,
            q = w / W,
            z = Math.abs(G) < Math.abs(q) ? G : q;
          if (z * z <= U) {
            R = Math.sqrt(U - z * z) * a, _ = O - Math.atan2(R, z), k = Math.atan2(R / u, (z - F) / l);
            break t
          }
        }
        var j = t.MathUtils.PI,
          H = F - y,
          Q = H * H,
          Z = 0,
          K = 0,
          J = F + y,
          $ = J * J,
          tt = 0;
        w = -y * F / (D - B), w >= -1 && w <= 1 && (w = Math.acos(w), C = y * Math.cos(w) + F, R = x * Math.sin(w), A = C * C + R * R, A < Q && (j = w, Q = A, H = C, Z = R), A > $ && (K = w, $ = A, J = C, tt = R)), U <= (Q + $) / 2 ? (_ = O - Math.atan2(Z * a, H), k = j * a) : (_ = O - Math.atan2(tt * a, J), k = K * a)
      }
      var et = Math.atan2(M, v) * f,
        rt = e.arotation;
      _ = (_ - et) * t.MathUtils.radDeg + d - rt, _ > 180 ? _ -= 360 : _ < -180 && (_ += 360), e.updateWorldTransformWith(s, h, rt + _ * o, e.ascaleX, e.ascaleY, 0, 0), rt = r.arotation, k = ((k + et) * t.MathUtils.radDeg - r.ashearX) * f + p - rt, k > 180 ? k -= 360 : k < -180 && (k += 360), r.updateWorldTransformWith(v, M, rt + k * o, r.ascaleX, r.ascaleY, r.ashearX, r.ashearY)
    }, e
  }();
  t.IkConstraint = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t) {
      this.order = 0, this.bones = new Array, this.bendDirection = 1, this.mix = 1, this.name = t
    }
    return t
  }();
  t.IkConstraintData = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t, e) {
      if (this.position = 0, this.spacing = 0, this.rotateMix = 0, this.translateMix = 0, this.spaces = new Array, this.positions = new Array, this.world = new Array, this.curves = new Array, this.lengths = new Array, this.segments = new Array, null == t) throw new Error("data cannot be null.");
      if (null == e) throw new Error("skeleton cannot be null.");
      this.data = t, this.bones = new Array;
      for (var r = 0, n = t.bones.length; r < n; r++) this.bones.push(e.findBone(t.bones[r].name));
      this.target = e.findSlot(t.target.name), this.position = t.position, this.spacing = t.spacing, this.rotateMix = t.rotateMix, this.translateMix = t.translateMix
    }
    return e.prototype.apply = function () {
      this.update()
    }, e.prototype.update = function () {
      var r = this.target.getAttachment();
      if (r instanceof t.PathAttachment) {
        var n = this.rotateMix,
          i = this.translateMix,
          a = i > 0,
          o = n > 0;
        if (a || o) {
          var s = this.data,
            h = s.spacingMode,
            l = h == t.SpacingMode.Length,
            u = s.rotateMode,
            c = u == t.RotateMode.Tangent,
            d = u == t.RotateMode.ChainScale,
            p = this.bones.length,
            f = c ? p : p + 1,
            v = this.bones,
            M = t.Utils.setArraySize(this.spaces, f),
            g = null,
            m = this.spacing;
          if (d || l) {
            d && (g = t.Utils.setArraySize(this.lengths, p));
            for (var y = 0, x = f - 1; y < x;) {
              var w = v[y],
                A = w.data.length;
              if (A < e.epsilon) d && (g[y] = 0), M[++y] = 0;
              else {
                var T = A * w.a,
                  E = A * w.c,
                  b = Math.sqrt(T * T + E * E);
                d && (g[y] = b), M[++y] = (l ? A + m : m) * b / A
              }
            }
          } else
            for (var y = 1; y < f; y++) M[y] = m;
          var C = this.computeWorldPositions(r, f, c, s.positionMode == t.PositionMode.Percent, h == t.SpacingMode.Percent),
            R = C[0],
            I = C[1],
            S = s.offsetRotation,
            P = !1;
          if (0 == S) P = u == t.RotateMode.Chain;
          else {
            P = !1;
            var V = this.target.bone;
            S *= V.a * V.d - V.b * V.c > 0 ? t.MathUtils.degRad : -t.MathUtils.degRad
          }
          for (var y = 0, V = 3; y < p; y++, V += 3) {
            var w = v[y];
            w.worldX += (R - w.worldX) * i, w.worldY += (I - w.worldY) * i;
            var T = C[V],
              E = C[V + 1],
              F = T - R,
              L = E - I;
            if (d) {
              var _ = g[y];
              if (0 != _) {
                var k = (Math.sqrt(F * F + L * L) / _ - 1) * n + 1;
                w.a *= k, w.c *= k
              }
            }
            if (R = T, I = E, o) {
              var N = w.a,
                D = w.b,
                B = w.c,
                U = w.d,
                O = 0,
                X = 0,
                Y = 0;
              if (O = c ? C[V - 1] : 0 == M[y + 1] ? C[V + 2] : Math.atan2(L, F), O -= Math.atan2(B, N), P) {
                X = Math.cos(O), Y = Math.sin(O);
                var W = w.data.length;
                R += (W * (X * N - Y * B) - F) * n, I += (W * (Y * N + X * B) - L) * n
              } else O += S;
              O > t.MathUtils.PI ? O -= t.MathUtils.PI2 : O < -t.MathUtils.PI && (O += t.MathUtils.PI2), O *= n, X = Math.cos(O), Y = Math.sin(O), w.a = X * N - Y * B, w.b = X * D - Y * U, w.c = Y * N + X * B, w.d = Y * D + X * U
            }
            w.appliedValid = !1
          }
        }
      }
    }, e.prototype.computeWorldPositions = function (r, n, i, a, o) {
      var s = this.target,
        h = this.position,
        l = this.spaces,
        u = t.Utils.setArraySize(this.positions, 3 * n + 2),
        c = null,
        d = r.closed,
        p = r.worldVerticesLength,
        f = p / 6,
        v = e.NONE;
      if (!r.constantSpeed) {
        var M = r.lengths;
        f -= d ? 1 : 2;
        var g = M[f];
        if (a && (h *= g), o)
          for (var m = 0; m < n; m++) l[m] *= g;
        c = t.Utils.setArraySize(this.world, 8);
        for (var m = 0, y = 0, x = 0; m < n; m++, y += 3) {
          var w = l[m];
          h += w;
          var A = h;
          if (d) A %= g, A < 0 && (A += g), x = 0;
          else {
            if (A < 0) {
              v != e.BEFORE && (v = e.BEFORE, r.computeWorldVertices(s, 2, 4, c, 0, 2)), this.addBeforePosition(A, c, 0, u, y);
              continue
            }
            if (A > g) {
              v != e.AFTER && (v = e.AFTER, r.computeWorldVertices(s, p - 6, 4, c, 0, 2)), this.addAfterPosition(A - g, c, 0, u, y);
              continue
            }
          }
          for (;; x++) {
            var T = M[x];
            if (!(A > T)) {
              if (0 == x) A /= T;
              else {
                var E = M[x - 1];
                A = (A - E) / (T - E)
              }
              break
            }
          }
          x != v && (v = x, d && x == f ? (r.computeWorldVertices(s, p - 4, 4, c, 0, 2), r.computeWorldVertices(s, 0, 4, c, 4, 2)) : r.computeWorldVertices(s, 6 * x + 2, 8, c, 0, 2)), this.addCurvePosition(A, c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], u, y, i || m > 0 && 0 == w)
        }
        return u
      }
      d ? (p += 2, c = t.Utils.setArraySize(this.world, p), r.computeWorldVertices(s, 2, p - 4, c, 0, 2), r.computeWorldVertices(s, 0, 2, c, p - 4, 2), c[p - 2] = c[0], c[p - 1] = c[1]) : (f--, p -= 4, c = t.Utils.setArraySize(this.world, p), r.computeWorldVertices(s, 2, p, c, 0, 2));
      for (var b = t.Utils.setArraySize(this.curves, f), C = 0, R = c[0], I = c[1], S = 0, P = 0, V = 0, F = 0, L = 0, _ = 0, k = 0, N = 0, D = 0, B = 0, U = 0, O = 0, X = 0, Y = 0, m = 0, W = 2; m < f; m++, W += 6) S = c[W], P = c[W + 1], V = c[W + 2], F = c[W + 3], L = c[W + 4], _ = c[W + 5], k = .1875 * (R - 2 * S + V), N = .1875 * (I - 2 * P + F), D = .09375 * (3 * (S - V) - R + L), B = .09375 * (3 * (P - F) - I + _), U = 2 * k + D, O = 2 * N + B, X = .75 * (S - R) + k + .16666667 * D, Y = .75 * (P - I) + N + .16666667 * B, C += Math.sqrt(X * X + Y * Y), X += U, Y += O, U += D, O += B, C += Math.sqrt(X * X + Y * Y), X += U, Y += O, C += Math.sqrt(X * X + Y * Y), X += U + D, Y += O + B, C += Math.sqrt(X * X + Y * Y), b[m] = C, R = L, I = _;
      if (a && (h *= C), o)
        for (var m = 0; m < n; m++) l[m] *= C;
      for (var G = this.segments, q = 0, m = 0, y = 0, x = 0, z = 0; m < n; m++, y += 3) {
        var w = l[m];
        h += w;
        var A = h;
        if (d) A %= C, A < 0 && (A += C), x = 0;
        else {
          if (A < 0) {
            this.addBeforePosition(A, c, 0, u, y);
            continue
          }
          if (A > C) {
            this.addAfterPosition(A - C, c, p - 4, u, y);
            continue
          }
        }
        for (;; x++) {
          var j = b[x];
          if (!(A > j)) {
            if (0 == x) A /= j;
            else {
              var E = b[x - 1];
              A = (A - E) / (j - E)
            }
            break
          }
        }
        if (x != v) {
          v = x;
          var H = 6 * x;
          for (R = c[H], I = c[H + 1], S = c[H + 2], P = c[H + 3], V = c[H + 4], F = c[H + 5], L = c[H + 6], _ = c[H + 7], k = .03 * (R - 2 * S + V), N = .03 * (I - 2 * P + F), D = .006 * (3 * (S - V) - R + L), B = .006 * (3 * (P - F) - I + _), U = 2 * k + D, O = 2 * N + B, X = .3 * (S - R) + k + .16666667 * D, Y = .3 * (P - I) + N + .16666667 * B, q = Math.sqrt(X * X + Y * Y), G[0] = q, H = 1; H < 8; H++) X += U, Y += O, U += D, O += B, q += Math.sqrt(X * X + Y * Y), G[H] = q;
          X += U, Y += O, q += Math.sqrt(X * X + Y * Y), G[8] = q, X += U + D, Y += O + B, q += Math.sqrt(X * X + Y * Y), G[9] = q, z = 0
        }
        for (A *= q;; z++) {
          var Q = G[z];
          if (!(A > Q)) {
            if (0 == z) A /= Q;
            else {
              var E = G[z - 1];
              A = z + (A - E) / (Q - E)
            }
            break
          }
        }
        this.addCurvePosition(.1 * A, R, I, S, P, V, F, L, _, u, y, i || m > 0 && 0 == w)
      }
      return u
    }, e.prototype.addBeforePosition = function (t, e, r, n, i) {
      var a = e[r],
        o = e[r + 1],
        s = e[r + 2] - a,
        h = e[r + 3] - o,
        l = Math.atan2(h, s);
      n[i] = a + t * Math.cos(l), n[i + 1] = o + t * Math.sin(l), n[i + 2] = l
    }, e.prototype.addAfterPosition = function (t, e, r, n, i) {
      var a = e[r + 2],
        o = e[r + 3],
        s = a - e[r],
        h = o - e[r + 1],
        l = Math.atan2(h, s);
      n[i] = a + t * Math.cos(l), n[i + 1] = o + t * Math.sin(l), n[i + 2] = l
    }, e.prototype.addCurvePosition = function (t, e, r, n, i, a, o, s, h, l, u, c) {
      (0 == t || isNaN(t)) && (t = 1e-4);
      var d = t * t,
        p = d * t,
        f = 1 - t,
        v = f * f,
        M = v * f,
        g = f * t,
        m = 3 * g,
        y = f * m,
        x = m * t,
        w = e * M + n * y + a * x + s * p,
        A = r * M + i * y + o * x + h * p;
      l[u] = w, l[u + 1] = A, c && (l[u + 2] = Math.atan2(A - (r * v + i * g * 2 + o * d), w - (e * v + n * g * 2 + a * d)))
    }, e.prototype.getOrder = function () {
      return this.data.order
    }, e.NONE = -1, e.BEFORE = -2, e.AFTER = -3, e.epsilon = 1e-5, e
  }();
  t.PathConstraint = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t) {
      this.order = 0, this.bones = new Array, this.name = t
    }
    return t
  }();
  t.PathConstraintData = e;
  var r;
  (function (t) {
    t[t.Fixed = 0] = "Fixed", t[t.Percent = 1] = "Percent"
  })(r = t.PositionMode || (t.PositionMode = {}));
  var n;
  (function (t) {
    t[t.Length = 0] = "Length", t[t.Fixed = 1] = "Fixed", t[t.Percent = 2] = "Percent"
  })(n = t.SpacingMode || (t.SpacingMode = {}));
  var i;
  (function (t) {
    t[t.Tangent = 0] = "Tangent", t[t.Chain = 1] = "Chain", t[t.ChainScale = 2] = "ChainScale"
  })(i = t.RotateMode || (t.RotateMode = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
      function t(t) {
        this.toLoad = new Array, this.assets = {}, this.clientId = t
      }
      return t.prototype.loaded = function () {
        var t = 0;
        for (var e in this.assets) t++;
        return t
      }, t
    }(),
    r = function () {
      function t(t) {
        void 0 === t && (t = ""), this.clientAssets = {}, this.queuedAssets = {}, this.rawAssets = {}, this.errors = {}, this.pathPrefix = t
      }
      return t.prototype.queueAsset = function (t, r, n) {
        var i = this.clientAssets[t];
        return null !== i && void 0 !== i || (i = new e(t), this.clientAssets[t] = i), null !== r && (i.textureLoader = r), i.toLoad.push(n), this.queuedAssets[n] !== n && (this.queuedAssets[n] = n, !0)
      }, t.prototype.loadText = function (t, e) {
        var r = this;
        if (e = this.pathPrefix + e, this.queueAsset(t, null, e)) {
          var n = new XMLHttpRequest;
          n.onreadystatechange = function () {
            n.readyState == XMLHttpRequest.DONE && (n.status >= 200 && n.status < 300 ? r.rawAssets[e] = n.responseText : r.errors[e] = "Couldn't load text " + e + ": status " + n.status + ", " + n.responseText)
          }, n.open("GET", e, !0), n.send()
        }
      }, t.prototype.loadJson = function (t, e) {
        var r = this;
        if (e = this.pathPrefix + e, this.queueAsset(t, null, e)) {
          var n = new XMLHttpRequest;
          n.onreadystatechange = function () {
            n.readyState == XMLHttpRequest.DONE && (n.status >= 200 && n.status < 300 ? r.rawAssets[e] = JSON.parse(n.responseText) : r.errors[e] = "Couldn't load text " + e + ": status " + n.status + ", " + n.responseText)
          }, n.open("GET", e, !0), n.send()
        }
      }, t.prototype.loadTexture = function (t, e, r) {
        var n = this;
        if (r = this.pathPrefix + r, this.queueAsset(t, e, r)) {
          var i = new Image;
          i.src = r, i.crossOrigin = "anonymous", i.onload = function (t) {
            n.rawAssets[r] = i
          }, i.onerror = function (t) {
            n.errors[r] = "Couldn't load image " + r
          }
        }
      }, t.prototype.get = function (t, e) {
        e = this.pathPrefix + e;
        var r = this.clientAssets[t];
        return null === r || void 0 === r || r.assets[e]
      }, t.prototype.updateClientAssets = function (t) {
        for (var e = 0; e < t.toLoad.length; e++) {
          var r = t.toLoad[e],
            n = t.assets[r];
          if (null === n || void 0 === n) {
            var i = this.rawAssets[r];
            if (null === i || void 0 === i) continue;
            i instanceof HTMLImageElement ? t.assets[r] = t.textureLoader(i) : t.assets[r] = i
          }
        }
      }, t.prototype.isLoadingComplete = function (t) {
        var e = this.clientAssets[t];
        return null === e || void 0 === e || (this.updateClientAssets(e), e.toLoad.length == e.loaded())
      }, t.prototype.dispose = function () {}, t.prototype.hasErrors = function () {
        return Object.keys(this.errors).length > 0
      }, t.prototype.getErrors = function () {
        return this.errors
      }, t
    }();
  t.SharedAssetManager = r
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(e) {
      if (this._updateCache = new Array, this.updateCacheReset = new Array, this.time = 0, this.flipX = !1, this.flipY = !1, this.x = 0, this.y = 0, null == e) throw new Error("data cannot be null.");
      this.data = e, this.bones = new Array;
      for (var r = 0; r < e.bones.length; r++) {
        var n = e.bones[r],
          i = void 0;
        if (null == n.parent) i = new t.Bone(n, this, null);
        else {
          var a = this.bones[n.parent.index];
          i = new t.Bone(n, this, a), a.children.push(i)
        }
        this.bones.push(i)
      }
      this.slots = new Array, this.drawOrder = new Array;
      for (var r = 0; r < e.slots.length; r++) {
        var o = e.slots[r],
          i = this.bones[o.boneData.index],
          s = new t.Slot(o, i);
        this.slots.push(s), this.drawOrder.push(s)
      }
      this.ikConstraints = new Array;
      for (var r = 0; r < e.ikConstraints.length; r++) {
        var h = e.ikConstraints[r];
        this.ikConstraints.push(new t.IkConstraint(h, this))
      }
      this.transformConstraints = new Array;
      for (var r = 0; r < e.transformConstraints.length; r++) {
        var l = e.transformConstraints[r];
        this.transformConstraints.push(new t.TransformConstraint(l, this))
      }
      this.pathConstraints = new Array;
      for (var r = 0; r < e.pathConstraints.length; r++) {
        var u = e.pathConstraints[r];
        this.pathConstraints.push(new t.PathConstraint(u, this))
      }
      this.color = new t.Color(1, 1, 1, 1), this.updateCache()
    }
    return e.prototype.updateCache = function () {
      var t = this._updateCache;
      t.length = 0, this.updateCacheReset.length = 0;
      for (var e = this.bones, r = 0, n = e.length; r < n; r++) e[r].sorted = !1;
      var i = this.ikConstraints,
        a = this.transformConstraints,
        o = this.pathConstraints,
        s = i.length,
        h = a.length,
        l = o.length,
        u = s + h + l;
      t: for (var r = 0; r < u; r++) {
        for (var c = 0; c < s; c++) {
          var d = i[c];
          if (d.data.order == r) {
            this.sortIkConstraint(d);
            continue t
          }
        }
        for (var c = 0; c < h; c++) {
          var d = a[c];
          if (d.data.order == r) {
            this.sortTransformConstraint(d);
            continue t
          }
        }
        for (var c = 0; c < l; c++) {
          var d = o[c];
          if (d.data.order == r) {
            this.sortPathConstraint(d);
            continue t
          }
        }
      }
      for (var r = 0, n = e.length; r < n; r++) this.sortBone(e[r])
    }, e.prototype.sortIkConstraint = function (t) {
      var e = t.target;
      this.sortBone(e);
      var r = t.bones,
        n = r[0];
      if (this.sortBone(n), r.length > 1) {
        var i = r[r.length - 1];
        this._updateCache.indexOf(i) > -1 || this.updateCacheReset.push(i)
      }
      this._updateCache.push(t), this.sortReset(n.children), r[r.length - 1].sorted = !0
    }, e.prototype.sortPathConstraint = function (e) {
      var r = e.target,
        n = r.data.index,
        i = r.bone;
      null != this.skin && this.sortPathConstraintAttachment(this.skin, n, i), null != this.data.defaultSkin && this.data.defaultSkin != this.skin && this.sortPathConstraintAttachment(this.data.defaultSkin, n, i);
      for (var a = 0, o = this.data.skins.length; a < o; a++) this.sortPathConstraintAttachment(this.data.skins[a], n, i);
      var s = r.getAttachment();
      s instanceof t.PathAttachment && this.sortPathConstraintAttachmentWith(s, i);
      for (var h = e.bones, l = h.length, a = 0; a < l; a++) this.sortBone(h[a]);
      this._updateCache.push(e);
      for (var a = 0; a < l; a++) this.sortReset(h[a].children);
      for (var a = 0; a < l; a++) h[a].sorted = !0
    }, e.prototype.sortTransformConstraint = function (t) {
      this.sortBone(t.target);
      var e = t.bones,
        r = e.length;
      if (t.data.local)
        for (var n = 0; n < r; n++) {
          var i = e[n];
          this.sortBone(i.parent), this._updateCache.indexOf(i) > -1 || this.updateCacheReset.push(i)
        } else
          for (var n = 0; n < r; n++) this.sortBone(e[n]);
      this._updateCache.push(t);
      for (var a = 0; a < r; a++) this.sortReset(e[a].children);
      for (var a = 0; a < r; a++) e[a].sorted = !0
    }, e.prototype.sortPathConstraintAttachment = function (t, e, r) {
      var n = t.attachments[e];
      if (n)
        for (var i in n) this.sortPathConstraintAttachmentWith(n[i], r)
    }, e.prototype.sortPathConstraintAttachmentWith = function (e, r) {
      if (e instanceof t.PathAttachment) {
        var n = e.bones;
        if (null == n) this.sortBone(r);
        else
          for (var i = this.bones, a = 0; a < n.length;)
            for (var o = n[a++], s = a + o; a < s; a++) {
              var h = n[a];
              this.sortBone(i[h])
            }
      }
    }, e.prototype.sortBone = function (t) {
      if (!t.sorted) {
        var e = t.parent;
        null != e && this.sortBone(e), t.sorted = !0, this._updateCache.push(t)
      }
    }, e.prototype.sortReset = function (t) {
      for (var e = 0, r = t.length; e < r; e++) {
        var n = t[e];
        n.sorted && this.sortReset(n.children), n.sorted = !1
      }
    }, e.prototype.updateWorldTransform = function () {
      for (var t = this.updateCacheReset, e = 0, r = t.length; e < r; e++) {
        var n = t[e];
        n.ax = n.x, n.ay = n.y, n.arotation = n.rotation, n.ascaleX = n.scaleX, n.ascaleY = n.scaleY, n.ashearX = n.shearX, n.ashearY = n.shearY, n.appliedValid = !0
      }
      for (var i = this._updateCache, e = 0, r = i.length; e < r; e++) i[e].update()
    }, e.prototype.setToSetupPose = function () {
      this.setBonesToSetupPose(), this.setSlotsToSetupPose()
    }, e.prototype.setBonesToSetupPose = function () {
      for (var t = this.bones, e = 0, r = t.length; e < r; e++) t[e].setToSetupPose();
      for (var n = this.ikConstraints, e = 0, r = n.length; e < r; e++) {
        var i = n[e];
        i.bendDirection = i.data.bendDirection, i.mix = i.data.mix
      }
      for (var a = this.transformConstraints, e = 0, r = a.length; e < r; e++) {
        var i = a[e],
          o = i.data;
        i.rotateMix = o.rotateMix, i.translateMix = o.translateMix, i.scaleMix = o.scaleMix, i.shearMix = o.shearMix
      }
      for (var s = this.pathConstraints, e = 0, r = s.length; e < r; e++) {
        var i = s[e],
          o = i.data;
        i.position = o.position, i.spacing = o.spacing, i.rotateMix = o.rotateMix, i.translateMix = o.translateMix
      }
    }, e.prototype.setSlotsToSetupPose = function () {
      var e = this.slots;
      t.Utils.arrayCopy(e, 0, this.drawOrder, 0, e.length);
      for (var r = 0, n = e.length; r < n; r++) e[r].setToSetupPose()
    }, e.prototype.getRootBone = function () {
      return 0 == this.bones.length ? null : this.bones[0]
    }, e.prototype.findBone = function (t) {
      if (null == t) throw new Error("boneName cannot be null.");
      for (var e = this.bones, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.data.name == t) return i
      }
      return null
    }, e.prototype.findBoneIndex = function (t) {
      if (null == t) throw new Error("boneName cannot be null.");
      for (var e = this.bones, r = 0, n = e.length; r < n; r++)
        if (e[r].data.name == t) return r;
      return -1
    }, e.prototype.findSlot = function (t) {
      if (null == t) throw new Error("slotName cannot be null.");
      for (var e = this.slots, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.data.name == t) return i
      }
      return null
    }, e.prototype.findSlotIndex = function (t) {
      if (null == t) throw new Error("slotName cannot be null.");
      for (var e = this.slots, r = 0, n = e.length; r < n; r++)
        if (e[r].data.name == t) return r;
      return -1
    }, e.prototype.setSkinByName = function (t) {
      var e = this.data.findSkin(t);
      if (null == e) throw new Error("Skin not found: " + t);
      this.setSkin(e)
    }, e.prototype.setSkin = function (t) {
      if (null != t)
        if (null != this.skin) t.attachAll(this, this.skin);
        else
          for (var e = this.slots, r = 0, n = e.length; r < n; r++) {
            var i = e[r],
              a = i.data.attachmentName;
            if (null != a) {
              var o = t.getAttachment(r, a);
              null != o && i.setAttachment(o)
            }
          }
      this.skin = t
    }, e.prototype.getAttachmentByName = function (t, e) {
      return this.getAttachment(this.data.findSlotIndex(t), e)
    }, e.prototype.getAttachment = function (t, e) {
      if (null == e) throw new Error("attachmentName cannot be null.");
      if (null != this.skin) {
        var r = this.skin.getAttachment(t, e);
        if (null != r) return r
      }
      return null != this.data.defaultSkin ? this.data.defaultSkin.getAttachment(t, e) : null
    }, e.prototype.setAttachment = function (t, e) {
      if (null == t) throw new Error("slotName cannot be null.");
      for (var r = this.slots, n = 0, i = r.length; n < i; n++) {
        var a = r[n];
        if (a.data.name == t) {
          var o = null;
          if (null != e && (o = this.getAttachment(n, e), null == o)) throw new Error("Attachment not found: " + e + ", for slot: " + t);
          return void a.setAttachment(o)
        }
      }
      throw new Error("Slot not found: " + t)
    }, e.prototype.findIkConstraint = function (t) {
      if (null == t) throw new Error("constraintName cannot be null.");
      for (var e = this.ikConstraints, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.data.name == t) return i
      }
      return null
    }, e.prototype.findTransformConstraint = function (t) {
      if (null == t) throw new Error("constraintName cannot be null.");
      for (var e = this.transformConstraints, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.data.name == t) return i
      }
      return null
    }, e.prototype.findPathConstraint = function (t) {
      if (null == t) throw new Error("constraintName cannot be null.");
      for (var e = this.pathConstraints, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.data.name == t) return i
      }
      return null
    }, e.prototype.getBounds = function (e, r, n) {
      if (null == e) throw new Error("offset cannot be null.");
      if (null == r) throw new Error("size cannot be null.");
      for (var i = this.drawOrder, a = Number.POSITIVE_INFINITY, o = Number.POSITIVE_INFINITY, s = Number.NEGATIVE_INFINITY, h = Number.NEGATIVE_INFINITY, l = 0, u = i.length; l < u; l++) {
        var c = i[l],
          d = 0,
          p = null,
          f = c.getAttachment();
        if (f instanceof t.RegionAttachment) d = 8, p = t.Utils.setArraySize(n, d, 0), f.computeWorldVertices(c.bone, p, 0, 2);
        else if (f instanceof t.MeshAttachment) {
          var v = f;
          d = v.worldVerticesLength, p = t.Utils.setArraySize(n, d, 0), v.computeWorldVertices(c, 0, d, p, 0, 2)
        }
        if (null != p)
          for (var M = 0, g = p.length; M < g; M += 2) {
            var m = p[M],
              y = p[M + 1];
            a = Math.min(a, m), o = Math.min(o, y), s = Math.max(s, m), h = Math.max(h, y)
          }
      }
      e.set(a, o), r.set(s - a, h - o)
    }, e.prototype.update = function (t) {
      this.time += t
    }, e
  }();
  t.Skeleton = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
      function t(t) {
        this.offset = 0, this.size = t.byteLength, this.buffer = new Uint8Array(t), this.floatBuf = new ArrayBuffer(4), this.floatBufIn = new Uint8Array(this.floatBuf), this.floatBufOut = new Float32Array(this.floatBuf), this.doubleBuf = new ArrayBuffer(8), this.doubleBufIn = new Uint8Array(this.doubleBuf), this.doubleBufOut = new Float64Array(this.doubleBuf)
      }
      return t.prototype.readByte = function () {
        return this.buffer[this.offset++]
      }, t.prototype.readSByte = function () {
        var t = this.readByte();
        return t > 127 && (t -= 256), t
      }, t.prototype.readBool = function () {
        return 0 != this.readByte()
      }, t.prototype.readShort = function () {
        var t = this.readByte();
        return t <<= 8, t |= this.readByte()
      }, t.prototype.readInt = function () {
        var t = this.readByte();
        return t <<= 8, t |= this.readByte(), t <<= 8, t |= this.readByte(), t <<= 8, t |= this.readByte()
      }, t.prototype.readVarInt = function (t) {
        void 0 === t && (t = !0);
        var e = this.readByte(),
          r = 127 & e;
        return 128 & e && (e = this.readByte(), r |= (127 & e) << 7, 128 & e && (e = this.readByte(), r |= (127 & e) << 14, 128 & e && (e = this.readByte(), r |= (127 & e) << 21, 128 & e && (e = this.readByte(), r |= (127 & e) << 28)))), t || (r = r >>> 1 ^ -(1 & r)), r
      }, t.prototype.readFloat = function () {
        return this.floatBufIn[3] = this.readByte(), this.floatBufIn[2] = this.readByte(), this.floatBufIn[1] = this.readByte(), this.floatBufIn[0] = this.readByte(), this.floatBufOut[0]
      }, t.prototype.readString = function () {
        var t = this.readVarInt();
        if (0 == t) return null;
        var e = new Uint8Array(this.buffer.buffer.slice(this.offset, this.offset + t - 1));
        return this.offset += t - 1, decodeURIComponent(escape(String.fromCharCode.apply(null, e)))
      }, t.prototype.readColor = function () {
        var t = [this.readByte() / 255, this.readByte() / 255, this.readByte() / 255, this.readByte() / 255];
        return 1 == t[0] && 1 == t[1] && 1 == t[2] && 1 == t[3] && (t = null), t
      }, t
    }(),
    r = function () {
      function r(t) {
        this.scale = 1, this.linkedMeshes = new Array, this.attachmentLoader = t
      }
      return r.prototype.readSkeletonData = function (r) {
        var n = this.scale,
          i = new t.SkeletonData,
          a = new e(r);
        i.hash = a.readString(), i.version = a.readString(), i.width = a.readFloat(), i.height = a.readFloat();
        var o = a.readBool();
        o && (i.fps = a.readFloat(), i.imagesPath = a.readString());
        for (var s = 0, h = a.readVarInt(); s < h; s++) {
          var l = a.readString(),
            u = null;
          if (s > 0) {
            var c = a.readVarInt();
            if (u = i.bones[c], null == u) throw new Error("Parent bone not found: " + c)
          }
          var d = new t.BoneData(s, l, u);
          d.rotation = a.readFloat(), d.x = a.readFloat() * n, d.y = a.readFloat() * n, d.scaleX = a.readFloat(), d.scaleY = a.readFloat(), d.shearX = a.readFloat(), d.shearY = a.readFloat(), d.length = a.readFloat() * n, d.transformMode = a.readByte(), o && a.readColor(), i.bones.push(d)
        }
        for (var s = 0, p = a.readVarInt(); s < p; s++) {
          var f = a.readString(),
            v = a.readVarInt(),
            M = i.bones[v];
          if (null == M) throw new Error("Slot bone not found: " + v);
          var d = new t.SlotData(s, f, M),
            g = a.readColor();
          null != g && d.color.set(g[0], g[1], g[2], g[3]);
          var m = a.readColor();
          null != m && (d.darkColor = new t.Color(1, 1, 1, 1), d.darkColor.set(m[0], m[1], m[2], m[3])), d.attachmentName = a.readString(), d.blendMode = a.readByte(), i.slots.push(d)
        }
        for (var s = 0, y = a.readVarInt(); s < y; s++) {
          var d = new t.IkConstraintData(a.readString());
          d.order = a.readVarInt();
          for (var x = 0, h = a.readVarInt(); x < h; x++) {
            var v = a.readVarInt(),
              w = i.bones[v];
            if (null == w) throw new Error("IK bone not found: " + v);
            d.bones.push(w)
          }
          var A = a.readVarInt();
          if (d.target = i.bones[A], null == d.target) throw new Error("IK target bone not found: " + A);
          d.mix = a.readFloat(), d.bendDirection = a.readSByte(), i.ikConstraints.push(d)
        }
        for (var s = 0, T = a.readVarInt(); s < T; s++) {
          var d = new t.TransformConstraintData(a.readString());
          d.order = a.readVarInt();
          for (var x = 0, h = a.readVarInt(); x < h; x++) {
            var v = a.readVarInt(),
              w = i.bones[v];
            if (null == w) throw new Error("Transform constraint bone not found: " + v);
            d.bones.push(w)
          }
          var A = a.readVarInt();
          if (d.target = i.bones[A], null == d.target) throw new Error("Transform constraint target bone not found: " + A);
          d.local = a.readBool(), d.relative = a.readBool(), d.offsetRotation = a.readFloat(), d.offsetX = a.readFloat(), d.offsetY = a.readFloat(), d.offsetScaleX = a.readFloat(), d.offsetScaleY = a.readFloat(), d.offsetShearY = a.readFloat(), d.rotateMix = a.readFloat(), d.translateMix = a.readFloat(), d.scaleMix = a.readFloat(), d.shearMix = a.readFloat(), i.transformConstraints.push(d)
        }
        for (var s = 0, E = a.readVarInt(); s < E; s++) {
          var d = new t.PathConstraintData(a.readString());
          d.order = a.readVarInt();
          for (var x = 0, h = a.readVarInt(); x < h; x++) {
            var v = a.readVarInt(),
              w = i.bones[v];
            if (null == w) throw new Error("Transform constraint bone not found: " + v);
            d.bones.push(w)
          }
          var A = a.readVarInt();
          if (d.target = i.slots[A], null == d.target) throw new Error("Path target slot not found: " + A);
          d.positionMode = a.readByte(), d.spacingMode = a.readByte(), d.rotateMode = a.readByte(), d.offsetRotation = a.readFloat(), d.position = a.readFloat(), d.positionMode == t.PositionMode.Fixed && (d.position *= n), d.spacing = a.readFloat(), d.spacingMode != t.SpacingMode.Length && d.spacingMode != t.SpacingMode.Fixed || (d.spacing *= n), d.rotateMix = a.readFloat(), d.translateMix = a.readFloat(), i.pathConstraints.push(d)
        }
        for (var b = new t.Skin("default"), s = 0, p = a.readVarInt(); s < p; s++)
          for (var C = a.readVarInt(), x = 0, R = a.readVarInt(); x < R; x++) {
            var I = a.readString(),
              S = this.readAttachment(a, b, C, I, i, o);
            null != S && b.addAttachment(C, I, S)
          }
        i.skins.push(b), i.defaultSkin = b;
        for (var s = 0, P = a.readVarInt(); s < P; s++) {
          for (var V = new t.Skin(a.readString()), x = 0, p = a.readVarInt(); x < p; x++)
            for (var C = a.readVarInt(), F = 0, R = a.readVarInt(); F < R; F++) {
              var I = a.readString(),
                S = this.readAttachment(a, V, C, I, i, o);
              null != S && V.addAttachment(C, I, S)
            }
          i.skins.push(V)
        }
        for (var s = 0, L = this.linkedMeshes.length; s < L; s++) {
          var _ = this.linkedMeshes[s],
            V = null == _.skin ? i.defaultSkin : i.findSkin(_.skin);
          if (null == V) throw new Error("Skin not found: " + _.skin);
          var k = V.getAttachment(_.slotIndex, _.parent);
          if (null == k) throw new Error("Parent mesh not found: " + _.parent);
          _.mesh.setParentMesh(k), _.mesh.updateUVs()
        }
        this.linkedMeshes.length = 0;
        for (var s = 0, N = a.readVarInt(); s < N; s++) {
          var d = new t.EventData(a.readString());
          d.intValue = a.readVarInt(!1), d.floatValue = a.readFloat(), d.stringValue = a.readString(), i.events.push(d)
        }
        for (var s = 0, D = a.readVarInt(); s < D; s++) {
          var B = a.readString();
          this.readAnimation(a, B, i)
        }
        return i
      }, r.prototype.readAttachment = function (e, r, i, a, o, s) {
        var h = this.scale,
          l = e.readString();
        l || (l = a);
        var u = e.readByte();
        switch (u) {
          case t.AttachmentType.Region:
            var c = e.readString();
            c || (c = l);
            var d = this.attachmentLoader.newRegionAttachment(r, l, c);
            if (null == d) return null;
            d.path = c, d.rotation = e.readFloat(), d.x = e.readFloat() * h, d.y = e.readFloat() * h, d.scaleX = e.readFloat(), d.scaleY = e.readFloat(), d.width = e.readFloat() * h, d.height = e.readFloat() * h;
            var p = e.readColor();
            return null != p && d.color.set(p[0], p[1], p[2], p[3]), d.updateOffset(), d;
          case t.AttachmentType.BoundingBox:
            var f = this.attachmentLoader.newBoundingBoxAttachment(r, l);
            if (null == f) return null;
            var v = e.readVarInt();
            if (this.readVertices(e, f, v), s) {
              var p = e.readColor();
              null != p && f.color.set(p[0], p[1], p[2], p[3])
            }
            return f;
          case t.AttachmentType.Mesh:
            var c = e.readString();
            c || (c = l);
            var M = this.attachmentLoader.newMeshAttachment(r, l, c);
            if (null == M) return null;
            M.path = c;
            var p = e.readColor();
            null != p && M.color.set(p[0], p[1], p[2], p[3]);
            for (var g = [], m = 0, y = e.readVarInt(); m < y; m++) g.push(e.readFloat()), g.push(e.readFloat());
            for (var x = [], m = 0, w = e.readVarInt(); m < w; m++) x.push(e.readShort());
            if (M.triangles = x, M.regionUVs = g, this.readVertices(e, M, g.length / 2), M.updateUVs(), M.hullLength = 2 * e.readVarInt(), s) {
              for (var A = [], m = 0, T = e.readVarInt(); m < T; m++) A.push(e.readShort());
              e.readFloat(), e.readFloat()
            }
            return M;
          case t.AttachmentType.LinkedMesh:
            var c = e.readString();
            c || (c = l);
            var M = this.attachmentLoader.newMeshAttachment(r, l, c);
            if (null == M) return null;
            M.path = c;
            var p = e.readColor();
            null != p && M.color.set(p[0], p[1], p[2], p[3]);
            var E = e.readString(),
              b = e.readString(),
              C = e.readBool();
            if (M.inheritDeform = C, this.linkedMeshes.push(new n(M, E, i, b)), s) {
              e.readFloat(), e.readFloat()
            }
            return M;
          case t.AttachmentType.Path:
            var c = this.attachmentLoader.newPathAttachment(r, l);
            if (null == c) return null;
            c.closed = e.readBool(), c.constantSpeed = e.readBool();
            var v = e.readVarInt();
            this.readVertices(e, c, v);
            for (var R = t.Utils.newArray(v / 3, 0), m = 0; m < R.length; m++) R[m] = e.readFloat() * h;
            if (c.lengths = R, s) {
              var p = e.readColor();
              null != p && c.color.set(p[0], p[1], p[2], p[3])
            }
            return c;
          case t.AttachmentType.Point:
            var I = this.attachmentLoader.newPointAttachment(r, l);
            if (null == I) return null;
            if (I.x = e.readFloat() * h, I.y = e.readFloat() * h, I.rotation = e.readFloat(), s) {
              var p = e.readColor();
              null != p && I.color.set(p[0], p[1], p[2], p[3])
            }
            return I;
          case t.AttachmentType.Clipping:
            var S = this.attachmentLoader.newClippingAttachment(r, l);
            if (null == S) return null;
            var P = e.readVarInt(),
              V = o.slots[P];
            if (null == V) throw new Error("Clipping end slot not found: " + P);
            S.endSlot = V;
            var v = e.readVarInt();
            if (this.readVertices(e, S, v), s) {
              var p = e.readColor();
              null != p && S.color.set(p[0], p[1], p[2], p[3])
            }
            return S
        }
        return null
      }, r.prototype.readVertices = function (e, r, n) {
        var i = this.scale;
        r.worldVerticesLength = 2 * n;
        var a = e.readBool();
        if (!a) {
          for (var o = new Array, s = 0; s < n; s++) o.push(e.readFloat()), o.push(e.readFloat());
          var h = t.Utils.toFloatArray(o);
          if (1 != i)
            for (var s = 0, l = o.length; s < l; s++) h[s] *= i;
          return void(r.vertices = h)
        }
        for (var u = new Array, c = new Array, s = 0, l = n; s < l; s++) {
          var d = e.readVarInt();
          c.push(d);
          for (var p = 0; p < d; p++) c.push(e.readVarInt()), u.push(e.readFloat() * i), u.push(e.readFloat() * i), u.push(e.readFloat())
        }
        r.bones = c, r.vertices = t.Utils.toFloatArray(u)
      }, r.prototype.readAnimation = function (e, r, n) {
        for (var i = this.scale, a = new Array, o = 0, s = 0, h = e.readVarInt(); s < h; s++)
          for (var l = e.readVarInt(), u = 0, c = e.readVarInt(); u < c; u++) {
            var d = e.readByte() + 4,
              p = e.readVarInt();
            if (d == t.TimelineType.attachment) {
              var f = new t.AttachmentTimeline(p);
              f.slotIndex = l;
              for (var v = 0, M = 0; M < p; M++) f.setFrame(v++, e.readFloat(), e.readString());
              a.push(f), o = Math.max(o, f.frames[f.getFrameCount() - 1])
            } else if (d == t.TimelineType.color) {
              var f = new t.ColorTimeline(p);
              f.slotIndex = l;
              for (var v = 0, g = 0; g < p; g++) {
                var m = e.readFloat(),
                  y = e.readColor();
                y || (y = [1, 1, 1, 1]), f.setFrame(v, m, y[0], y[1], y[2], y[3]), v < p - 1 && this.readCurve(e, f, v), v++
              }
              a.push(f), o = Math.max(o, f.frames[(f.getFrameCount() - 1) * t.ColorTimeline.ENTRIES])
            } else {
              if (d != t.TimelineType.deform) throw new Error("Invalid timeline type for a slot: " + d + " (" + l + ")");
              var f = new t.TwoColorTimeline(p);
              f.slotIndex = l;
              for (var v = 0, x = 0; x < p; x++) {
                var m = e.readFloat(),
                  w = e.readColor(),
                  A = e.readColor();
                w || (w = [1, 1, 1, 1]), A || (A = [1, 1, 1, 1]), f.setFrame(v, m, w[0], w[1], w[2], w[3], A[0], A[1], A[2]), v < p - 1 && this.readCurve(e, f, v), v++
              }
              a.push(f), o = Math.max(o, f.frames[(f.getFrameCount() - 1) * t.TwoColorTimeline.ENTRIES])
            }
          }
        for (var s = 0, T = e.readVarInt(); s < T; s++)
          for (var E = e.readVarInt(), u = 0, c = e.readVarInt(); u < c; u++) {
            var d = e.readByte(),
              p = e.readVarInt();
            if (d === t.TimelineType.rotate) {
              var f = new t.RotateTimeline(p);
              f.boneIndex = E;
              for (var v = 0, b = 0; b < p; b++) f.setFrame(v, e.readFloat(), e.readFloat()), v < p - 1 && this.readCurve(e, f, v), v++;
              a.push(f), o = Math.max(o, f.frames[(f.getFrameCount() - 1) * t.RotateTimeline.ENTRIES])
            } else {
              if (d !== t.TimelineType.translate && d !== t.TimelineType.scale && d !== t.TimelineType.shear) throw new Error("Invalid timeline type for a bone: " + d + " (" + E + ")");
              var f = null,
                C = 1;
              d === t.TimelineType.scale ? f = new t.ScaleTimeline(p) : d === t.TimelineType.shear ? f = new t.ShearTimeline(p) : (f = new t.TranslateTimeline(p), C = i), f.boneIndex = E;
              for (var v = 0, R = 0; R < p; R++) {
                var m = e.readFloat(),
                  I = e.readFloat(),
                  S = e.readFloat();
                f.setFrame(v, m, I * C, S * C), v < p - 1 && this.readCurve(e, f, v), v++
              }
              a.push(f), o = Math.max(o, f.frames[(f.getFrameCount() - 1) * t.TranslateTimeline.ENTRIES])
            }
          }
        for (var s = 0, P = e.readVarInt(); s < P; s++) {
          var V = e.readVarInt(),
            p = e.readVarInt(),
            f = new t.IkConstraintTimeline(p);
          f.ikConstraintIndex = V;
          for (var v = 0, F = 0; F < p; F++) f.setFrame(v, e.readFloat(), e.readFloat(), e.readSByte()), v < p - 1 && this.readCurve(e, f, v), v++;
          a.push(f), o = Math.max(o, f.frames[(f.getFrameCount() - 1) * t.IkConstraintTimeline.ENTRIES])
        }
        for (var s = 0, P = e.readVarInt(); s < P; s++) {
          var L = e.readVarInt(),
            p = e.readVarInt(),
            f = new t.TransformConstraintTimeline(p);
          f.transformConstraintIndex = L;
          for (var v = 0, _ = 0; _ < p; _++) f.setFrame(v, e.readFloat(), e.readFloat(), e.readFloat(), e.readFloat(), e.readFloat()), v < p - 1 && this.readCurve(e, f, v), v++;
          a.push(f), o = Math.max(o, f.frames[(f.getFrameCount() - 1) * t.TransformConstraintTimeline.ENTRIES])
        }
        for (var s = 0, P = e.readVarInt(); s < P; s++)
          for (var k = e.readVarInt(), N = n.pathConstraints[k], u = 0, D = e.readVarInt(); u < D; u++) {
            var d = e.readByte() + 11,
              p = e.readVarInt();
            if (d === t.TimelineType.pathConstraintPosition || d === t.TimelineType.pathConstraintSpacing) {
              var f = null,
                C = 1;
              d === t.TimelineType.pathConstraintSpacing ? (f = new t.PathConstraintSpacingTimeline(p), N.spacingMode != t.SpacingMode.Length && N.spacingMode != t.SpacingMode.Fixed || (C = i)) : (f = new t.PathConstraintPositionTimeline(p), N.positionMode == t.PositionMode.Fixed && (C = i)), f.pathConstraintIndex = k;
              for (var v = 0, B = 0; B < p; B++) f.setFrame(v, e.readFloat(), e.readFloat() * C), v < p - 1 && this.readCurve(e, f, v), v++;
              a.push(f), o = Math.max(o, f.frames[(f.getFrameCount() - 1) * t.PathConstraintPositionTimeline.ENTRIES])
            } else if (d === t.TimelineType.pathConstraintMix) {
              var f = new t.PathConstraintMixTimeline(p);
              f.pathConstraintIndex = k;
              for (var v = 0, U = 0; U < p; U++) f.setFrame(v, e.readFloat(), e.readFloat(), e.readFloat()), v < p - 1 && this.readCurve(e, f, v), v++;
              a.push(f), o = Math.max(o, f.frames[(f.getFrameCount() - 1) * t.PathConstraintMixTimeline.ENTRIES])
            }
          }
        for (var s = 0, P = e.readVarInt(); s < P; s++) {
          var O = e.readVarInt(),
            X = n.skins[O];
          if (null == X) throw new Error("Skin not found: " + O);
          for (var u = 0, D = e.readVarInt(); u < D; u++)
            for (var l = e.readVarInt(), Y = 0, W = e.readVarInt(); Y < W; Y++) {
              var G = e.readString(),
                q = X.getAttachment(l, G);
              if (null == q) throw new Error("Deform attachment not found: " + G);
              var z = null != q.bones,
                j = q.vertices,
                H = z ? j.length / 3 * 2 : j.length,
                p = e.readVarInt(),
                f = new t.DeformTimeline(p);
              f.slotIndex = l, f.attachment = q;
              for (var v = 0, Q = 0; Q < p; Q++) {
                var m = e.readFloat(),
                  Z = e.readVarInt(),
                  K = void 0;
                if (0 == Z) K = z ? t.Utils.newFloatArray(H) : j;
                else {
                  K = t.Utils.newFloatArray(H);
                  var J = e.readVarInt();
                  if (Z += J, 1 == i)
                    for (var $ = J; $ < Z; $++) K[$] = e.readFloat();
                  else
                    for (var $ = J; $ < Z; $++) K[$] = e.readFloat() * i;
                  if (!z)
                    for (var $ = 0, tt = K.length; $ < tt; $++) K[$] += j[$]
                }
                f.setFrame(v, m, K), v < p - 1 && this.readCurve(e, f, v), v++
              }
              a.push(f), o = Math.max(o, f.frames[f.getFrameCount() - 1])
            }
        }
        var et = e.readVarInt();
        if (et > 0) {
          for (var f = new t.DrawOrderTimeline(et), h = n.slots.length, s = 0; s < et; s++) {
            for (var m = e.readFloat(), rt = e.readVarInt(), nt = t.Utils.newArray(h, -1), it = new Array(h - rt), at = 0, ot = 0, u = 0; u < rt; u++) {
              for (var l = e.readVarInt(); at != l;) it[ot++] = at++;
              nt[at + e.readVarInt()] = at++
            }
            for (; at < h;) it[ot++] = at++;
            for (var u = h - 1; u >= 0; u--) nt[u] == -1 && (nt[u] = it[--ot]);
            f.setFrame(s, m, nt)
          }
          a.push(f), o = Math.max(o, f.frames[f.getFrameCount() - 1])
        }
        var st = e.readVarInt();
        if (st > 0) {
          for (var f = new t.EventTimeline(st), s = 0; s < st; s++) {
            var m = e.readFloat(),
              ht = e.readVarInt(),
              lt = n.events[ht];
            if (null == lt) throw new Error("Event not found: " + ht);
            var ut = new t.Event(t.Utils.toSinglePrecision(m), lt);
            ut.intValue = e.readVarInt(!1), ut.floatValue = e.readFloat(), ut.stringValue = e.readBool() ? e.readString() : lt.stringValue, f.setFrame(s, ut)
          }
          a.push(f), o = Math.max(o, f.frames[f.getFrameCount() - 1])
        }
        if (isNaN(o)) throw new Error("Error while parsing animation, duration is NaN");
        n.animations.push(new t.Animation(r, a, o))
      }, r.prototype.readCurve = function (e, r, n) {
        var i = e.readByte();
        i === t.CurveTimeline.STEPPED ? r.setStepped(n) : i === t.CurveTimeline.BEZIER && r.setCurve(n, e.readFloat(), e.readFloat(), e.readFloat(), e.readFloat())
      }, r
    }();
  t.SkeletonBinary = r;
  var n = function () {
    function t(t, e, r, n) {
      this.mesh = t, this.skin = e, this.slotIndex = r, this.parent = n
    }
    return t
  }()
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e() {
      this.minX = 0, this.minY = 0, this.maxX = 0, this.maxY = 0, this.boundingBoxes = new Array, this.polygons = new Array, this.polygonPool = new t.Pool(function () {
        return t.Utils.newFloatArray(16)
      })
    }
    return e.prototype.update = function (e, r) {
      if (null == e) throw new Error("skeleton cannot be null.");
      var n = this.boundingBoxes,
        i = this.polygons,
        a = this.polygonPool,
        o = e.slots,
        s = o.length;
      n.length = 0, a.freeAll(i), i.length = 0;
      for (var h = 0; h < s; h++) {
        var l = o[h],
          u = l.getAttachment();
        if (u instanceof t.BoundingBoxAttachment) {
          var c = u;
          n.push(c);
          var d = a.obtain();
          d.length != c.worldVerticesLength && (d = t.Utils.newFloatArray(c.worldVerticesLength)), i.push(d), c.computeWorldVertices(l, 0, c.worldVerticesLength, d, 0, 2)
        }
      }
      r ? this.aabbCompute() : (this.minX = Number.POSITIVE_INFINITY, this.minY = Number.POSITIVE_INFINITY, this.maxX = Number.NEGATIVE_INFINITY, this.maxY = Number.NEGATIVE_INFINITY)
    }, e.prototype.aabbCompute = function () {
      for (var t = Number.POSITIVE_INFINITY, e = Number.POSITIVE_INFINITY, r = Number.NEGATIVE_INFINITY, n = Number.NEGATIVE_INFINITY, i = this.polygons, a = 0, o = i.length; a < o; a++)
        for (var s = i[a], h = s, l = 0, u = s.length; l < u; l += 2) {
          var c = h[l],
            d = h[l + 1];
          t = Math.min(t, c), e = Math.min(e, d), r = Math.max(r, c), n = Math.max(n, d)
        }
      this.minX = t, this.minY = e, this.maxX = r, this.maxY = n
    }, e.prototype.aabbContainsPoint = function (t, e) {
      return t >= this.minX && t <= this.maxX && e >= this.minY && e <= this.maxY
    }, e.prototype.aabbIntersectsSegment = function (t, e, r, n) {
      var i = this.minX,
        a = this.minY,
        o = this.maxX,
        s = this.maxY;
      if (t <= i && r <= i || e <= a && n <= a || t >= o && r >= o || e >= s && n >= s) return !1;
      var h = (n - e) / (r - t),
        l = h * (i - t) + e;
      if (l > a && l < s) return !0;
      if (l = h * (o - t) + e, l > a && l < s) return !0;
      var u = (a - e) / h + t;
      return u > i && u < o || (u = (s - e) / h + t, u > i && u < o)
    }, e.prototype.aabbIntersectsSkeleton = function (t) {
      return this.minX < t.maxX && this.maxX > t.minX && this.minY < t.maxY && this.maxY > t.minY
    }, e.prototype.containsPoint = function (t, e) {
      for (var r = this.polygons, n = 0, i = r.length; n < i; n++)
        if (this.containsPointPolygon(r[n], t, e)) return this.boundingBoxes[n];
      return null
    }, e.prototype.containsPointPolygon = function (t, e, r) {
      for (var n = t, i = t.length, a = i - 2, o = !1, s = 0; s < i; s += 2) {
        var h = n[s + 1],
          l = n[a + 1];
        if (h < r && l >= r || l < r && h >= r) {
          var u = n[s];
          u + (r - h) / (l - h) * (n[a] - u) < e && (o = !o)
        }
        a = s
      }
      return o
    }, e.prototype.intersectsSegment = function (t, e, r, n) {
      for (var i = this.polygons, a = 0, o = i.length; a < o; a++)
        if (this.intersectsSegmentPolygon(i[a], t, e, r, n)) return this.boundingBoxes[a];
      return null
    }, e.prototype.intersectsSegmentPolygon = function (t, e, r, n, i) {
      for (var a = t, o = t.length, s = e - n, h = r - i, l = e * i - r * n, u = a[o - 2], c = a[o - 1], d = 0; d < o; d += 2) {
        var p = a[d],
          f = a[d + 1],
          v = u * f - c * p,
          M = u - p,
          g = c - f,
          m = s * g - h * M,
          y = (l * M - s * v) / m;
        if ((y >= u && y <= p || y >= p && y <= u) && (y >= e && y <= n || y >= n && y <= e)) {
          var x = (l * g - h * v) / m;
          if ((x >= c && x <= f || x >= f && x <= c) && (x >= r && x <= i || x >= i && x <= r)) return !0
        }
        u = p, c = f
      }
      return !1
    }, e.prototype.getPolygon = function (t) {
      if (null == t) throw new Error("boundingBox cannot be null.");
      var e = this.boundingBoxes.indexOf(t);
      return e == -1 ? null : this.polygons[e]
    }, e.prototype.getWidth = function () {
      return this.maxX - this.minX
    }, e.prototype.getHeight = function () {
      return this.maxY - this.minY
    }, e
  }();
  t.SkeletonBounds = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e() {
      this.triangulator = new t.Triangulator, this.clippingPolygon = new Array, this.clipOutput = new Array, this.clippedVertices = new Array, this.clippedTriangles = new Array, this.scratch = new Array
    }
    return e.prototype.clipStart = function (r, n) {
      if (null != this.clipAttachment) return 0;
      this.clipAttachment = n;
      var i = n.worldVerticesLength,
        a = t.Utils.setArraySize(this.clippingPolygon, i);
      n.computeWorldVertices(r, 0, i, a, 0, 2);
      var o = this.clippingPolygon;
      e.makeClockwise(o);
      for (var s = this.clippingPolygons = this.triangulator.decompose(o, this.triangulator.triangulate(o)), h = 0, l = s.length; h < l; h++) {
        var u = s[h];
        e.makeClockwise(u), u.push(u[0]), u.push(u[1])
      }
      return s.length
    }, e.prototype.clipEndWithSlot = function (t) {
      null != this.clipAttachment && this.clipAttachment.endSlot == t.data && this.clipEnd()
    }, e.prototype.clipEnd = function () {
      null != this.clipAttachment && (this.clipAttachment = null, this.clippingPolygons = null, this.clippedVertices.length = 0, this.clippedTriangles.length = 0, this.clippingPolygon.length = 0)
    }, e.prototype.isClipping = function () {
      return null != this.clipAttachment
    }, e.prototype.clipTriangles = function (e, r, n, i, a, o, s, h) {
      var l = this.clipOutput,
        u = this.clippedVertices,
        c = this.clippedTriangles,
        d = this.clippingPolygons,
        p = this.clippingPolygons.length,
        f = h ? 12 : 8,
        v = 0;
      u.length = 0, c.length = 0;
      t: for (var M = 0; M < i; M += 3) {
        var g = n[M] << 1,
          m = e[g],
          y = e[g + 1],
          x = a[g],
          w = a[g + 1];
        g = n[M + 1] << 1;
        var A = e[g],
          T = e[g + 1],
          E = a[g],
          b = a[g + 1];
        g = n[M + 2] << 1;
        for (var C = e[g], R = e[g + 1], I = a[g], S = a[g + 1], P = 0; P < p; P++) {
          var V = u.length;
          if (!this.clip(m, y, A, T, C, R, d[P], l)) {
            var F = t.Utils.setArraySize(u, V + 3 * f);
            F[V] = m, F[V + 1] = y, F[V + 2] = o.r, F[V + 3] = o.g, F[V + 4] = o.b, F[V + 5] = o.a, h ? (F[V + 6] = x, F[V + 7] = w, F[V + 8] = s.r, F[V + 9] = s.g, F[V + 10] = s.b, F[V + 11] = s.a, F[V + 12] = A, F[V + 13] = T, F[V + 14] = o.r, F[V + 15] = o.g, F[V + 16] = o.b, F[V + 17] = o.a, F[V + 18] = E, F[V + 19] = b, F[V + 20] = s.r, F[V + 21] = s.g, F[V + 22] = s.b, F[V + 23] = s.a, F[V + 24] = C, F[V + 25] = R, F[V + 26] = o.r, F[V + 27] = o.g, F[V + 28] = o.b, F[V + 29] = o.a, F[V + 30] = I, F[V + 31] = S, F[V + 32] = s.r, F[V + 33] = s.g, F[V + 34] = s.b, F[V + 35] = s.a) : (F[V + 6] = x, F[V + 7] = w, F[V + 8] = A, F[V + 9] = T, F[V + 10] = o.r, F[V + 11] = o.g, F[V + 12] = o.b, F[V + 13] = o.a, F[V + 14] = E, F[V + 15] = b, F[V + 16] = C, F[V + 17] = R, F[V + 18] = o.r, F[V + 19] = o.g, F[V + 20] = o.b, F[V + 21] = o.a, F[V + 22] = I, F[V + 23] = S), V = c.length;
            var L = t.Utils.setArraySize(c, V + 3);
            L[V] = v, L[V + 1] = v + 1, L[V + 2] = v + 2, v += 3;
            continue t
          }
          var _ = l.length;
          if (0 != _) {
            for (var k = T - R, N = C - A, D = m - C, B = R - y, U = 1 / (k * D + N * (y - R)), O = _ >> 1, X = this.clipOutput, F = t.Utils.setArraySize(u, V + O * f), Y = 0; Y < _; Y += 2) {
              var W = X[Y],
                G = X[Y + 1];
              F[V] = W, F[V + 1] = G, F[V + 2] = o.r, F[V + 3] = o.g, F[V + 4] = o.b, F[V + 5] = o.a;
              var q = W - C,
                z = G - R,
                j = (k * q + N * z) * U,
                H = (B * q + D * z) * U,
                Q = 1 - j - H;
              F[V + 6] = x * j + E * H + I * Q, F[V + 7] = w * j + b * H + S * Q, h && (F[V + 8] = s.r, F[V + 9] = s.g, F[V + 10] = s.b, F[V + 11] = s.a), V += f
            }
            V = c.length;
            var L = t.Utils.setArraySize(c, V + 3 * (O - 2));
            O--;
            for (var Y = 1; Y < O; Y++) L[V] = v, L[V + 1] = v + Y, L[V + 2] = v + Y + 1, V += 3;
            v += O + 1
          }
        }
      }
    }, e.prototype.clip = function (t, e, r, n, i, a, o, s) {
      var h = s,
        l = !1,
        u = null;
      o.length % 4 >= 2 ? (u = s, s = this.scratch) : u = this.scratch, u.length = 0, u.push(t), u.push(e), u.push(r), u.push(n), u.push(i), u.push(a), u.push(t), u.push(e), s.length = 0;
      for (var c = o, d = o.length - 4, p = 0;; p += 2) {
        for (var f = c[p], v = c[p + 1], M = c[p + 2], g = c[p + 3], m = f - M, y = v - g, x = u, w = u.length - 2, A = s.length, T = 0; T < w; T += 2) {
          var E = x[T],
            b = x[T + 1],
            C = x[T + 2],
            R = x[T + 3],
            I = m * (R - g) - y * (C - M) > 0;
          if (m * (b - g) - y * (E - M) > 0) {
            if (I) {
              s.push(C), s.push(R);
              continue
            }
            var S = R - b,
              P = C - E,
              V = (P * (v - b) - S * (f - E)) / (S * (M - f) - P * (g - v));
            s.push(f + (M - f) * V), s.push(v + (g - v) * V)
          } else if (I) {
            var S = R - b,
              P = C - E,
              V = (P * (v - b) - S * (f - E)) / (S * (M - f) - P * (g - v));
            s.push(f + (M - f) * V), s.push(v + (g - v) * V), s.push(C), s.push(R)
          }
          l = !0
        }
        if (A == s.length) return h.length = 0, !0;
        if (s.push(s[0]), s.push(s[1]), p == d) break;
        var F = s;
        s = u, s.length = 0, u = F
      }
      if (h != s) {
        h.length = 0;
        for (var p = 0, L = s.length - 2; p < L; p++) h[p] = s[p]
      } else h.length = h.length - 2;
      return l
    }, e.makeClockwise = function (t) {
      for (var e = t, r = t.length, n = e[r - 2] * e[1] - e[0] * e[r - 1], i = 0, a = 0, o = 0, s = 0, h = 0, l = r - 3; h < l; h += 2) i = e[h], a = e[h + 1], o = e[h + 2], s = e[h + 3], n += i * s - o * a;
      if (!(n < 0))
        for (var h = 0, u = r - 2, l = r >> 1; h < l; h += 2) {
          var c = e[h],
            d = e[h + 1],
            p = u - h;
          e[h] = e[p], e[h + 1] = e[p + 1], e[p] = c, e[p + 1] = d
        }
    }, e
  }();
  t.SkeletonClipping = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t() {
      this.bones = new Array, this.slots = new Array, this.skins = new Array, this.events = new Array, this.animations = new Array, this.ikConstraints = new Array, this.transformConstraints = new Array, this.pathConstraints = new Array, this.fps = 0
    }
    return t.prototype.findBone = function (t) {
      if (null == t) throw new Error("boneName cannot be null.");
      for (var e = this.bones, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.name == t) return i
      }
      return null
    }, t.prototype.findBoneIndex = function (t) {
      if (null == t) throw new Error("boneName cannot be null.");
      for (var e = this.bones, r = 0, n = e.length; r < n; r++)
        if (e[r].name == t) return r;
      return -1
    }, t.prototype.findSlot = function (t) {
      if (null == t) throw new Error("slotName cannot be null.");
      for (var e = this.slots, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.name == t) return i
      }
      return null
    }, t.prototype.findSlotIndex = function (t) {
      if (null == t) throw new Error("slotName cannot be null.");
      for (var e = this.slots, r = 0, n = e.length; r < n; r++)
        if (e[r].name == t) return r;
      return -1
    }, t.prototype.findSkin = function (t) {
      if (null == t) throw new Error("skinName cannot be null.");
      for (var e = this.skins, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.name == t) return i
      }
      return null
    }, t.prototype.findEvent = function (t) {
      if (null == t) throw new Error("eventDataName cannot be null.");
      for (var e = this.events, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.name == t) return i
      }
      return null
    }, t.prototype.findAnimation = function (t) {
      if (null == t) throw new Error("animationName cannot be null.");
      for (var e = this.animations, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.name == t) return i
      }
      return null
    }, t.prototype.findIkConstraint = function (t) {
      if (null == t) throw new Error("constraintName cannot be null.");
      for (var e = this.ikConstraints, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.name == t) return i
      }
      return null
    }, t.prototype.findTransformConstraint = function (t) {
      if (null == t) throw new Error("constraintName cannot be null.");
      for (var e = this.transformConstraints, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.name == t) return i
      }
      return null
    }, t.prototype.findPathConstraint = function (t) {
      if (null == t) throw new Error("constraintName cannot be null.");
      for (var e = this.pathConstraints, r = 0, n = e.length; r < n; r++) {
        var i = e[r];
        if (i.name == t) return i
      }
      return null
    }, t.prototype.findPathConstraintIndex = function (t) {
      if (null == t) throw new Error("pathConstraintName cannot be null.");
      for (var e = this.pathConstraints, r = 0, n = e.length; r < n; r++)
        if (e[r].name == t) return r;
      return -1
    }, t
  }();
  t.SkeletonData = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t) {
      this.scale = 1, this.linkedMeshes = new Array, this.attachmentLoader = t
    }
    return e.prototype.readSkeletonData = function (r) {
      var n = this.scale,
        i = new t.SkeletonData,
        a = "string" == typeof r ? JSON.parse(r) : r,
        o = a.skeleton;
      if (null != o && (i.hash = o.hash, i.version = o.spine, i.width = o.width, i.height = o.height, i.fps = o.fps, i.imagesPath = o.images), a.bones)
        for (var s = 0; s < a.bones.length; s++) {
          var h = a.bones[s],
            l = null,
            u = this.getValue(h, "parent", null);
          if (null != u && (l = i.findBone(u), null == l)) throw new Error("Parent bone not found: " + u);
          var c = new t.BoneData(i.bones.length, h.name, l);
          c.length = this.getValue(h, "length", 0) * n, c.x = this.getValue(h, "x", 0) * n, c.y = this.getValue(h, "y", 0) * n, c.rotation = this.getValue(h, "rotation", 0), c.scaleX = this.getValue(h, "scaleX", 1), c.scaleY = this.getValue(h, "scaleY", 1), c.shearX = this.getValue(h, "shearX", 0), c.shearY = this.getValue(h, "shearY", 0), c.transformMode = e.transformModeFromString(this.getValue(h, "transform", "normal")), i.bones.push(c)
        }
      if (a.slots)
        for (var s = 0; s < a.slots.length; s++) {
          var d = a.slots[s],
            p = d.name,
            f = d.bone,
            v = i.findBone(f);
          if (null == v) throw new Error("Slot bone not found: " + f);
          var c = new t.SlotData(i.slots.length, p, v),
            M = this.getValue(d, "color", null);
          null != M && c.color.setFromString(M);
          var g = this.getValue(d, "dark", null);
          null != g && (c.darkColor = new t.Color(1, 1, 1, 1), c.darkColor.setFromString(g)), c.attachmentName = this.getValue(d, "attachment", null), c.blendMode = e.blendModeFromString(this.getValue(d, "blend", "normal")), i.slots.push(c)
        }
      if (a.ik)
        for (var s = 0; s < a.ik.length; s++) {
          var m = a.ik[s],
            c = new t.IkConstraintData(m.name);
          c.order = this.getValue(m, "order", 0);
          for (var y = 0; y < m.bones.length; y++) {
            var f = m.bones[y],
              x = i.findBone(f);
            if (null == x) throw new Error("IK bone not found: " + f);
            c.bones.push(x)
          }
          var w = m.target;
          if (c.target = i.findBone(w), null == c.target) throw new Error("IK target bone not found: " + w);
          c.bendDirection = this.getValue(m, "bendPositive", !0) ? 1 : -1, c.mix = this.getValue(m, "mix", 1), i.ikConstraints.push(c)
        }
      if (a.transform)
        for (var s = 0; s < a.transform.length; s++) {
          var m = a.transform[s],
            c = new t.TransformConstraintData(m.name);
          c.order = this.getValue(m, "order", 0);
          for (var y = 0; y < m.bones.length; y++) {
            var f = m.bones[y],
              x = i.findBone(f);
            if (null == x) throw new Error("Transform constraint bone not found: " + f);
            c.bones.push(x)
          }
          var w = m.target;
          if (c.target = i.findBone(w), null == c.target) throw new Error("Transform constraint target bone not found: " + w);
          c.local = this.getValue(m, "local", !1), c.relative = this.getValue(m, "relative", !1), c.offsetRotation = this.getValue(m, "rotation", 0), c.offsetX = this.getValue(m, "x", 0) * n, c.offsetY = this.getValue(m, "y", 0) * n, c.offsetScaleX = this.getValue(m, "scaleX", 0), c.offsetScaleY = this.getValue(m, "scaleY", 0), c.offsetShearY = this.getValue(m, "shearY", 0), c.rotateMix = this.getValue(m, "rotateMix", 1), c.translateMix = this.getValue(m, "translateMix", 1), c.scaleMix = this.getValue(m, "scaleMix", 1), c.shearMix = this.getValue(m, "shearMix", 1), i.transformConstraints.push(c)
        }
      if (a.path)
        for (var s = 0; s < a.path.length; s++) {
          var m = a.path[s],
            c = new t.PathConstraintData(m.name);
          c.order = this.getValue(m, "order", 0);
          for (var y = 0; y < m.bones.length; y++) {
            var f = m.bones[y],
              x = i.findBone(f);
            if (null == x) throw new Error("Transform constraint bone not found: " + f);
            c.bones.push(x)
          }
          var w = m.target;
          if (c.target = i.findSlot(w), null == c.target) throw new Error("Path target slot not found: " + w);
          c.positionMode = e.positionModeFromString(this.getValue(m, "positionMode", "percent")), c.spacingMode = e.spacingModeFromString(this.getValue(m, "spacingMode", "length")), c.rotateMode = e.rotateModeFromString(this.getValue(m, "rotateMode", "tangent")), c.offsetRotation = this.getValue(m, "rotation", 0), c.position = this.getValue(m, "position", 0), c.positionMode == t.PositionMode.Fixed && (c.position *= n), c.spacing = this.getValue(m, "spacing", 0), c.spacingMode != t.SpacingMode.Length && c.spacingMode != t.SpacingMode.Fixed || (c.spacing *= n), c.rotateMix = this.getValue(m, "rotateMix", 1), c.translateMix = this.getValue(m, "translateMix", 1), i.pathConstraints.push(c)
        }
      if (a.skins)
        for (var A in a.skins) {
          var T = a.skins[A],
            E = new t.Skin(A);
          for (var p in T) {
            var b = i.findSlotIndex(p);
            if (b == -1) throw new Error("Slot not found: " + p);
            var d = T[p];
            for (var C in d) {
              var R = this.readAttachment(d[C], E, b, C, i);
              null != R && E.addAttachment(b, C, R)
            }
          }
          i.skins.push(E), "default" == E.name && (i.defaultSkin = E)
        }
      for (var s = 0, I = this.linkedMeshes.length; s < I; s++) {
        var S = this.linkedMeshes[s],
          E = null == S.skin ? i.defaultSkin : i.findSkin(S.skin);
        if (null == E) throw new Error("Skin not found: " + S.skin);
        var P = E.getAttachment(S.slotIndex, S.parent);
        if (null == P) throw new Error("Parent mesh not found: " + S.parent);
        S.mesh.setParentMesh(P), S.mesh.updateUVs()
      }
      if (this.linkedMeshes.length = 0, a.events)
        for (var V in a.events) {
          var F = a.events[V],
            c = new t.EventData(V);
          c.intValue = this.getValue(F, "int", 0), c.floatValue = this.getValue(F, "float", 0), c.stringValue = this.getValue(F, "string", ""), i.events.push(c)
        }
      if (a.animations)
        for (var L in a.animations) {
          var _ = a.animations[L];
          this.readAnimation(_, L, i)
        }
      return i
    }, e.prototype.readAttachment = function (e, n, i, a, o) {
      var s = this.scale;
      a = this.getValue(e, "name", a);
      var h = this.getValue(e, "type", "region");
      switch (h) {
        case "region":
          var l = this.getValue(e, "path", a),
            u = this.attachmentLoader.newRegionAttachment(n, a, l);
          if (null == u) return null;
          u.path = l, u.x = this.getValue(e, "x", 0) * s, u.y = this.getValue(e, "y", 0) * s, u.scaleX = this.getValue(e, "scaleX", 1),
            u.scaleY = this.getValue(e, "scaleY", 1), u.rotation = this.getValue(e, "rotation", 0), u.width = e.width * s, u.height = e.height * s;
          var c = this.getValue(e, "color", null);
          return null != c && u.color.setFromString(c), u.updateOffset(), u;
        case "boundingbox":
          var d = this.attachmentLoader.newBoundingBoxAttachment(n, a);
          if (null == d) return null;
          this.readVertices(e, d, e.vertexCount << 1);
          var c = this.getValue(e, "color", null);
          return null != c && d.color.setFromString(c), d;
        case "mesh":
        case "linkedmesh":
          var l = this.getValue(e, "path", a),
            p = this.attachmentLoader.newMeshAttachment(n, a, l);
          if (null == p) return null;
          p.path = l;
          var c = this.getValue(e, "color", null);
          null != c && p.color.setFromString(c);
          var f = this.getValue(e, "parent", null);
          if (null != f) return p.inheritDeform = this.getValue(e, "deform", !0), this.linkedMeshes.push(new r(p, this.getValue(e, "skin", null), i, f)), p;
          var v = e.uvs;
          return this.readVertices(e, p, v.length), p.triangles = e.triangles, p.regionUVs = v, p.updateUVs(), p.hullLength = 2 * this.getValue(e, "hull", 0), p;
        case "path":
          var l = this.attachmentLoader.newPathAttachment(n, a);
          if (null == l) return null;
          l.closed = this.getValue(e, "closed", !1), l.constantSpeed = this.getValue(e, "constantSpeed", !0);
          var M = e.vertexCount;
          this.readVertices(e, l, M << 1);
          for (var g = t.Utils.newArray(M / 3, 0), m = 0; m < e.lengths.length; m++) g[m] = e.lengths[m] * s;
          l.lengths = g;
          var c = this.getValue(e, "color", null);
          return null != c && l.color.setFromString(c), l;
        case "point":
          var y = this.attachmentLoader.newPointAttachment(n, a);
          if (null == y) return null;
          y.x = this.getValue(e, "x", 0) * s, y.y = this.getValue(e, "y", 0) * s, y.rotation = this.getValue(e, "rotation", 0);
          var c = this.getValue(e, "color", null);
          return null != c && y.color.setFromString(c), y;
        case "clipping":
          var x = this.attachmentLoader.newClippingAttachment(n, a);
          if (null == x) return null;
          var w = this.getValue(e, "end", null);
          if (null != w) {
            var A = o.findSlot(w);
            if (null == A) throw new Error("Clipping end slot not found: " + w);
            x.endSlot = A
          }
          var M = e.vertexCount;
          this.readVertices(e, x, M << 1);
          var c = this.getValue(e, "color", null);
          return null != c && x.color.setFromString(c), x
      }
      return null
    }, e.prototype.readVertices = function (e, r, n) {
      var i = this.scale;
      r.worldVerticesLength = n;
      var a = e.vertices;
      if (n == a.length) {
        var o = t.Utils.toFloatArray(a);
        if (1 != i)
          for (var s = 0, h = a.length; s < h; s++) o[s] *= i;
        return void(r.vertices = o)
      }
      for (var l = new Array, u = new Array, s = 0, h = a.length; s < h;) {
        var c = a[s++];
        u.push(c);
        for (var d = s + 4 * c; s < d; s += 4) u.push(a[s]), l.push(a[s + 1] * i), l.push(a[s + 2] * i), l.push(a[s + 3])
      }
      r.bones = u, r.vertices = t.Utils.toFloatArray(l)
    }, e.prototype.readAnimation = function (e, r, n) {
      var i = this.scale,
        a = new Array,
        o = 0;
      if (e.slots)
        for (var s in e.slots) {
          var h = e.slots[s],
            l = n.findSlotIndex(s);
          if (l == -1) throw new Error("Slot not found: " + s);
          for (var u in h) {
            var c = h[u];
            if ("attachment" == u) {
              var d = new t.AttachmentTimeline(c.length);
              d.slotIndex = l;
              for (var p = 0, f = 0; f < c.length; f++) {
                var v = c[f];
                d.setFrame(p++, v.time, v.name)
              }
              a.push(d), o = Math.max(o, d.frames[d.getFrameCount() - 1])
            } else if ("color" == u) {
              var d = new t.ColorTimeline(c.length);
              d.slotIndex = l;
              for (var p = 0, f = 0; f < c.length; f++) {
                var v = c[f],
                  M = new t.Color;
                M.setFromString(v.color), d.setFrame(p, v.time, M.r, M.g, M.b, M.a), this.readCurve(v, d, p), p++
              }
              a.push(d), o = Math.max(o, d.frames[(d.getFrameCount() - 1) * t.ColorTimeline.ENTRIES])
            } else {
              if ("twoColor" != u) throw new Error("Invalid timeline type for a slot: " + u + " (" + s + ")");
              var d = new t.TwoColorTimeline(c.length);
              d.slotIndex = l;
              for (var p = 0, f = 0; f < c.length; f++) {
                var v = c[f],
                  g = new t.Color,
                  m = new t.Color;
                g.setFromString(v.light), m.setFromString(v.dark), d.setFrame(p, v.time, g.r, g.g, g.b, g.a, m.r, m.g, m.b), this.readCurve(v, d, p), p++
              }
              a.push(d), o = Math.max(o, d.frames[(d.getFrameCount() - 1) * t.TwoColorTimeline.ENTRIES])
            }
          }
        }
      if (e.bones)
        for (var y in e.bones) {
          var x = e.bones[y],
            w = n.findBoneIndex(y);
          if (w == -1) throw new Error("Bone not found: " + y);
          for (var u in x) {
            var c = x[u];
            if ("rotate" === u) {
              var d = new t.RotateTimeline(c.length);
              d.boneIndex = w;
              for (var p = 0, f = 0; f < c.length; f++) {
                var v = c[f];
                d.setFrame(p, v.time, v.angle), this.readCurve(v, d, p), p++
              }
              a.push(d), o = Math.max(o, d.frames[(d.getFrameCount() - 1) * t.RotateTimeline.ENTRIES])
            } else {
              if ("translate" !== u && "scale" !== u && "shear" !== u) throw new Error("Invalid timeline type for a bone: " + u + " (" + y + ")");
              var d = null,
                A = 1;
              "scale" === u ? d = new t.ScaleTimeline(c.length) : "shear" === u ? d = new t.ShearTimeline(c.length) : (d = new t.TranslateTimeline(c.length), A = i), d.boneIndex = w;
              for (var p = 0, f = 0; f < c.length; f++) {
                var v = c[f],
                  T = this.getValue(v, "x", 0),
                  E = this.getValue(v, "y", 0);
                d.setFrame(p, v.time, T * A, E * A), this.readCurve(v, d, p), p++
              }
              a.push(d), o = Math.max(o, d.frames[(d.getFrameCount() - 1) * t.TranslateTimeline.ENTRIES])
            }
          }
        }
      if (e.ik)
        for (var b in e.ik) {
          var C = e.ik[b],
            R = n.findIkConstraint(b),
            d = new t.IkConstraintTimeline(C.length);
          d.ikConstraintIndex = n.ikConstraints.indexOf(R);
          for (var p = 0, f = 0; f < C.length; f++) {
            var v = C[f];
            d.setFrame(p, v.time, this.getValue(v, "mix", 1), this.getValue(v, "bendPositive", !0) ? 1 : -1), this.readCurve(v, d, p), p++
          }
          a.push(d), o = Math.max(o, d.frames[(d.getFrameCount() - 1) * t.IkConstraintTimeline.ENTRIES])
        }
      if (e.transform)
        for (var b in e.transform) {
          var C = e.transform[b],
            R = n.findTransformConstraint(b),
            d = new t.TransformConstraintTimeline(C.length);
          d.transformConstraintIndex = n.transformConstraints.indexOf(R);
          for (var p = 0, f = 0; f < C.length; f++) {
            var v = C[f];
            d.setFrame(p, v.time, this.getValue(v, "rotateMix", 1), this.getValue(v, "translateMix", 1), this.getValue(v, "scaleMix", 1), this.getValue(v, "shearMix", 1)), this.readCurve(v, d, p), p++
          }
          a.push(d), o = Math.max(o, d.frames[(d.getFrameCount() - 1) * t.TransformConstraintTimeline.ENTRIES])
        }
      if (e.paths)
        for (var b in e.paths) {
          var C = e.paths[b],
            I = n.findPathConstraintIndex(b);
          if (I == -1) throw new Error("Path constraint not found: " + b);
          var S = n.pathConstraints[I];
          for (var u in C) {
            var c = C[u];
            if ("position" === u || "spacing" === u) {
              var d = null,
                A = 1;
              "spacing" === u ? (d = new t.PathConstraintSpacingTimeline(c.length), S.spacingMode != t.SpacingMode.Length && S.spacingMode != t.SpacingMode.Fixed || (A = i)) : (d = new t.PathConstraintPositionTimeline(c.length), S.positionMode == t.PositionMode.Fixed && (A = i)), d.pathConstraintIndex = I;
              for (var p = 0, f = 0; f < c.length; f++) {
                var v = c[f];
                d.setFrame(p, v.time, this.getValue(v, u, 0) * A), this.readCurve(v, d, p), p++
              }
              a.push(d), o = Math.max(o, d.frames[(d.getFrameCount() - 1) * t.PathConstraintPositionTimeline.ENTRIES])
            } else if ("mix" === u) {
              var d = new t.PathConstraintMixTimeline(c.length);
              d.pathConstraintIndex = I;
              for (var p = 0, f = 0; f < c.length; f++) {
                var v = c[f];
                d.setFrame(p, v.time, this.getValue(v, "rotateMix", 1), this.getValue(v, "translateMix", 1)), this.readCurve(v, d, p), p++
              }
              a.push(d), o = Math.max(o, d.frames[(d.getFrameCount() - 1) * t.PathConstraintMixTimeline.ENTRIES])
            }
          }
        }
      if (e.deform)
        for (var P in e.deform) {
          var V = e.deform[P],
            F = n.findSkin(P);
          if (null == F) throw new Error("Skin not found: " + P);
          for (var s in V) {
            var h = V[s],
              l = n.findSlotIndex(s);
            if (l == -1) throw new Error("Slot not found: " + h.name);
            for (var u in h) {
              var c = h[u],
                L = F.getAttachment(l, u);
              if (null == L) throw new Error("Deform attachment not found: " + c.name);
              var _ = null != L.bones,
                k = L.vertices,
                N = _ ? k.length / 3 * 2 : k.length,
                d = new t.DeformTimeline(c.length);
              d.slotIndex = l, d.attachment = L;
              for (var p = 0, D = 0; D < c.length; D++) {
                var v = c[D],
                  B = void 0,
                  U = this.getValue(v, "vertices", null);
                if (null == U) B = _ ? t.Utils.newFloatArray(N) : k;
                else {
                  B = t.Utils.newFloatArray(N);
                  var O = this.getValue(v, "offset", 0);
                  if (t.Utils.arrayCopy(U, 0, B, O, U.length), 1 != i)
                    for (var f = O, X = f + U.length; f < X; f++) B[f] *= i;
                  if (!_)
                    for (var f = 0; f < N; f++) B[f] += k[f]
                }
                d.setFrame(p, v.time, B), this.readCurve(v, d, p), p++
              }
              a.push(d), o = Math.max(o, d.frames[d.getFrameCount() - 1])
            }
          }
        }
      var Y = e.drawOrder;
      if (null == Y && (Y = e.draworder), null != Y) {
        for (var d = new t.DrawOrderTimeline(Y.length), W = n.slots.length, p = 0, D = 0; D < Y.length; D++) {
          var G = Y[D],
            q = null,
            z = this.getValue(G, "offsets", null);
          if (null != z) {
            q = t.Utils.newArray(W, -1);
            for (var j = t.Utils.newArray(W - z.length, 0), H = 0, Q = 0, f = 0; f < z.length; f++) {
              var Z = z[f],
                l = n.findSlotIndex(Z.slot);
              if (l == -1) throw new Error("Slot not found: " + Z.slot);
              for (; H != l;) j[Q++] = H++;
              q[H + Z.offset] = H++
            }
            for (; H < W;) j[Q++] = H++;
            for (var f = W - 1; f >= 0; f--) q[f] == -1 && (q[f] = j[--Q])
          }
          d.setFrame(p++, G.time, q)
        }
        a.push(d), o = Math.max(o, d.frames[d.getFrameCount() - 1])
      }
      if (e.events) {
        for (var d = new t.EventTimeline(e.events.length), p = 0, f = 0; f < e.events.length; f++) {
          var K = e.events[f],
            J = n.findEvent(K.name);
          if (null == J) throw new Error("Event not found: " + K.name);
          var $ = new t.Event(t.Utils.toSinglePrecision(K.time), J);
          $.intValue = this.getValue(K, "int", J.intValue), $.floatValue = this.getValue(K, "float", J.floatValue), $.stringValue = this.getValue(K, "string", J.stringValue), d.setFrame(p++, $)
        }
        a.push(d), o = Math.max(o, d.frames[d.getFrameCount() - 1])
      }
      if (isNaN(o)) throw new Error("Error while parsing animation, duration is NaN");
      n.animations.push(new t.Animation(r, a, o))
    }, e.prototype.readCurve = function (t, e, r) {
      if (t.curve)
        if ("stepped" === t.curve) e.setStepped(r);
        else if ("[object Array]" === Object.prototype.toString.call(t.curve)) {
        var n = t.curve;
        e.setCurve(r, n[0], n[1], n[2], n[3])
      }
    }, e.prototype.getValue = function (t, e, r) {
      return void 0 !== t[e] ? t[e] : r
    }, e.blendModeFromString = function (e) {
      if (e = e.toLowerCase(), "normal" == e) return t.BlendMode.Normal;
      if ("additive" == e) return t.BlendMode.Additive;
      if ("multiply" == e) return t.BlendMode.Multiply;
      if ("screen" == e) return t.BlendMode.Screen;
      throw new Error("Unknown blend mode: " + e)
    }, e.positionModeFromString = function (e) {
      if (e = e.toLowerCase(), "fixed" == e) return t.PositionMode.Fixed;
      if ("percent" == e) return t.PositionMode.Percent;
      throw new Error("Unknown position mode: " + e)
    }, e.spacingModeFromString = function (e) {
      if (e = e.toLowerCase(), "length" == e) return t.SpacingMode.Length;
      if ("fixed" == e) return t.SpacingMode.Fixed;
      if ("percent" == e) return t.SpacingMode.Percent;
      throw new Error("Unknown position mode: " + e)
    }, e.rotateModeFromString = function (e) {
      if (e = e.toLowerCase(), "tangent" == e) return t.RotateMode.Tangent;
      if ("chain" == e) return t.RotateMode.Chain;
      if ("chainscale" == e) return t.RotateMode.ChainScale;
      throw new Error("Unknown rotate mode: " + e)
    }, e.transformModeFromString = function (e) {
      if (e = e.toLowerCase(), "normal" == e) return t.TransformMode.Normal;
      if ("onlytranslation" == e) return t.TransformMode.OnlyTranslation;
      if ("norotationorreflection" == e) return t.TransformMode.NoRotationOrReflection;
      if ("noscale" == e) return t.TransformMode.NoScale;
      if ("noscaleorreflection" == e) return t.TransformMode.NoScaleOrReflection;
      throw new Error("Unknown transform mode: " + e)
    }, e
  }();
  t.SkeletonJson = e;
  var r = function () {
    function t(t, e, r, n) {
      this.mesh = t, this.skin = e, this.slotIndex = r, this.parent = n
    }
    return t
  }()
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t) {
      if (this.attachments = new Array, null == t) throw new Error("name cannot be null.");
      this.name = t
    }
    return t.prototype.addAttachment = function (t, e, r) {
      if (null == r) throw new Error("attachment cannot be null.");
      var n = this.attachments;
      t >= n.length && (n.length = t + 1), n[t] || (n[t] = {}), n[t][e] = r
    }, t.prototype.getAttachment = function (t, e) {
      var r = this.attachments[t];
      return r ? r[e] : null
    }, t.prototype.attachAll = function (t, e) {
      for (var r = 0, n = 0; n < t.slots.length; n++) {
        var i = t.slots[n],
          a = i.getAttachment();
        if (a && r < e.attachments.length) {
          var o = e.attachments[r];
          for (var s in o) {
            var h = o[s];
            if (a == h) {
              var l = this.getAttachment(r, s);
              null != l && i.setAttachment(l);
              break
            }
          }
        }
        r++
      }
    }, t
  }();
  t.Skin = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(e, r) {
      if (this.attachmentVertices = new Array, null == e) throw new Error("data cannot be null.");
      if (null == r) throw new Error("bone cannot be null.");
      this.data = e, this.bone = r, this.color = new t.Color, this.darkColor = null == e.darkColor ? null : new t.Color, this.setToSetupPose()
    }
    return e.prototype.getAttachment = function () {
      return this.attachment
    }, e.prototype.setAttachment = function (t) {
      this.attachment != t && (this.attachment = t, this.attachmentTime = this.bone.skeleton.time, this.attachmentVertices.length = 0)
    }, e.prototype.setAttachmentTime = function (t) {
      this.attachmentTime = this.bone.skeleton.time - t
    }, e.prototype.getAttachmentTime = function () {
      return this.bone.skeleton.time - this.attachmentTime
    }, e.prototype.setToSetupPose = function () {
      this.color.setFromColor(this.data.color), null != this.darkColor && this.darkColor.setFromColor(this.data.darkColor), null == this.data.attachmentName ? this.attachment = null : (this.attachment = null, this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName)))
    }, e
  }();
  t.Slot = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(e, r, n) {
      if (this.color = new t.Color(1, 1, 1, 1), e < 0) throw new Error("index must be >= 0.");
      if (null == r) throw new Error("name cannot be null.");
      if (null == n) throw new Error("boneData cannot be null.");
      this.index = e, this.name = r, this.boneData = n
    }
    return e
  }();
  t.SlotData = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t) {
      this._image = t
    }
    return t.prototype.getImage = function () {
      return this._image
    }, t.filterFromString = function (t) {
      switch (t.toLowerCase()) {
        case "nearest":
          return r.Nearest;
        case "linear":
          return r.Linear;
        case "mipmap":
          return r.MipMap;
        case "mipmapnearestnearest":
          return r.MipMapNearestNearest;
        case "mipmaplinearnearest":
          return r.MipMapLinearNearest;
        case "mipmapnearestlinear":
          return r.MipMapNearestLinear;
        case "mipmaplinearlinear":
          return r.MipMapLinearLinear;
        default:
          throw new Error("Unknown texture filter " + t)
      }
    }, t.wrapFromString = function (t) {
      switch (t.toLowerCase()) {
        case "mirroredtepeat":
          return n.MirroredRepeat;
        case "clamptoedge":
          return n.ClampToEdge;
        case "repeat":
          return n.Repeat;
        default:
          throw new Error("Unknown texture wrap " + t)
      }
    }, t
  }();
  t.Texture = e;
  var r;
  (function (t) {
    t[t.Nearest = 9728] = "Nearest", t[t.Linear = 9729] = "Linear", t[t.MipMap = 9987] = "MipMap", t[t.MipMapNearestNearest = 9984] = "MipMapNearestNearest", t[t.MipMapLinearNearest = 9985] = "MipMapLinearNearest", t[t.MipMapNearestLinear = 9986] = "MipMapNearestLinear", t[t.MipMapLinearLinear = 9987] = "MipMapLinearLinear"
  })(r = t.TextureFilter || (t.TextureFilter = {}));
  var n;
  (function (t) {
    t[t.MirroredRepeat = 33648] = "MirroredRepeat", t[t.ClampToEdge = 33071] = "ClampToEdge", t[t.Repeat = 10497] = "Repeat"
  })(n = t.TextureWrap || (t.TextureWrap = {}));
  var i = function () {
    function t() {
      this.u = 0, this.v = 0, this.u2 = 0, this.v2 = 0, this.width = 0, this.height = 0, this.rotate = !1, this.offsetX = 0, this.offsetY = 0, this.originalWidth = 0, this.originalHeight = 0
    }
    return t
  }();
  t.TextureRegion = i;
  var a = function (t) {
    function e() {
      return null !== t && t.apply(this, arguments) || this
    }
    return __extends(e, t), e.prototype.setFilters = function (t, e) {}, e.prototype.setWraps = function (t, e) {}, e.prototype.dispose = function () {}, e
  }(t.Texture);
  t.FakeTexture = a
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t, e) {
      this.pages = new Array, this.regions = new Array, this.load(t, e)
    }
    return e.prototype.load = function (e, a) {
      if (null == a) throw new Error("textureLoader cannot be null.");
      for (var o = new r(e), s = new Array(4), h = null;;) {
        var l = o.readLine();
        if (null == l) break;
        if (l = l.trim(), 0 == l.length) h = null;
        else if (h) {
          var u = new i;
          u.name = l, u.page = h, u.rotate = "true" == o.readValue(), o.readTuple(s);
          var c = parseInt(s[0]),
            d = parseInt(s[1]);
          o.readTuple(s);
          var p = parseInt(s[0]),
            f = parseInt(s[1]);
          u.u = c / h.width, u.v = d / h.height, u.rotate ? (u.u2 = (c + f) / h.width, u.v2 = (d + p) / h.height) : (u.u2 = (c + p) / h.width, u.v2 = (d + f) / h.height), u.x = c, u.y = d, u.width = Math.abs(p), u.height = Math.abs(f), 4 == o.readTuple(s) && 4 == o.readTuple(s) && o.readTuple(s), u.originalWidth = parseInt(s[0]), u.originalHeight = parseInt(s[1]), o.readTuple(s), u.offsetX = parseInt(s[0]), u.offsetY = parseInt(s[1]), u.index = parseInt(o.readValue()), u.texture = h.texture, this.regions.push(u)
        } else {
          h = new n, h.name = l, 2 == o.readTuple(s) && (h.width = parseInt(s[0]), h.height = parseInt(s[1]), o.readTuple(s)), o.readTuple(s), h.minFilter = t.Texture.filterFromString(s[0]), h.magFilter = t.Texture.filterFromString(s[1]);
          var v = o.readValue();
          h.uWrap = t.TextureWrap.ClampToEdge, h.vWrap = t.TextureWrap.ClampToEdge, "x" == v ? h.uWrap = t.TextureWrap.Repeat : "y" == v ? h.vWrap = t.TextureWrap.Repeat : "xy" == v && (h.uWrap = h.vWrap = t.TextureWrap.Repeat), h.texture = a(l), h.texture.setFilters(h.minFilter, h.magFilter), h.texture.setWraps(h.uWrap, h.vWrap), h.width = h.texture.getImage().width, h.height = h.texture.getImage().height, this.pages.push(h)
        }
      }
    }, e.prototype.findRegion = function (t) {
      for (var e = 0; e < this.regions.length; e++)
        if (this.regions[e].name == t) return this.regions[e];
      return null
    }, e.prototype.dispose = function () {
      for (var t = 0; t < this.pages.length; t++) this.pages[t].texture.dispose()
    }, e
  }();
  t.TextureAtlas = e;
  var r = function () {
      function t(t) {
        this.index = 0, this.lines = t.split(/\r\n|\r|\n/)
      }
      return t.prototype.readLine = function () {
        return this.index >= this.lines.length ? null : this.lines[this.index++]
      }, t.prototype.readValue = function () {
        var t = this.readLine(),
          e = t.indexOf(":");
        if (e == -1) throw new Error("Invalid line: " + t);
        return t.substring(e + 1).trim()
      }, t.prototype.readTuple = function (t) {
        var e = this.readLine(),
          r = e.indexOf(":");
        if (r == -1) throw new Error("Invalid line: " + e);
        for (var n = 0, i = r + 1; n < 3; n++) {
          var a = e.indexOf(",", i);
          if (a == -1) break;
          t[n] = e.substr(i, a - i).trim(), i = a + 1
        }
        return t[n] = e.substring(i).trim(), n + 1
      }, t
    }(),
    n = function () {
      function t() {}
      return t
    }();
  t.TextureAtlasPage = n;
  var i = function (t) {
    function e() {
      return null !== t && t.apply(this, arguments) || this
    }
    return __extends(e, t), e
  }(t.TextureRegion);
  t.TextureAtlasRegion = i
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(e, r) {
      if (this.rotateMix = 0, this.translateMix = 0, this.scaleMix = 0, this.shearMix = 0, this.temp = new t.Vector2, null == e) throw new Error("data cannot be null.");
      if (null == r) throw new Error("skeleton cannot be null.");
      this.data = e, this.rotateMix = e.rotateMix, this.translateMix = e.translateMix, this.scaleMix = e.scaleMix, this.shearMix = e.shearMix, this.bones = new Array;
      for (var n = 0; n < e.bones.length; n++) this.bones.push(r.findBone(e.bones[n].name));
      this.target = r.findBone(e.target.name)
    }
    return e.prototype.apply = function () {
      this.update()
    }, e.prototype.update = function () {
      this.data.local ? this.data.relative ? this.applyRelativeLocal() : this.applyAbsoluteLocal() : this.data.relative ? this.applyRelativeWorld() : this.applyAbsoluteWorld()
    }, e.prototype.applyAbsoluteWorld = function () {
      for (var e = this.rotateMix, r = this.translateMix, n = this.scaleMix, i = this.shearMix, a = this.target, o = a.a, s = a.b, h = a.c, l = a.d, u = o * l - s * h > 0 ? t.MathUtils.degRad : -t.MathUtils.degRad, c = this.data.offsetRotation * u, d = this.data.offsetShearY * u, p = this.bones, f = 0, v = p.length; f < v; f++) {
        var M = p[f],
          g = !1;
        if (0 != e) {
          var m = M.a,
            y = M.b,
            x = M.c,
            w = M.d,
            A = Math.atan2(h, o) - Math.atan2(x, m) + c;
          A > t.MathUtils.PI ? A -= t.MathUtils.PI2 : A < -t.MathUtils.PI && (A += t.MathUtils.PI2), A *= e;
          var T = Math.cos(A),
            E = Math.sin(A);
          M.a = T * m - E * x, M.b = T * y - E * w, M.c = E * m + T * x, M.d = E * y + T * w, g = !0
        }
        if (0 != r) {
          var b = this.temp;
          a.localToWorld(b.set(this.data.offsetX, this.data.offsetY)), M.worldX += (b.x - M.worldX) * r, M.worldY += (b.y - M.worldY) * r, g = !0
        }
        if (n > 0) {
          var C = Math.sqrt(M.a * M.a + M.c * M.c),
            R = Math.sqrt(o * o + h * h);
          C > 1e-5 && (C = (C + (R - C + this.data.offsetScaleX) * n) / C), M.a *= C, M.c *= C, C = Math.sqrt(M.b * M.b + M.d * M.d), R = Math.sqrt(s * s + l * l), C > 1e-5 && (C = (C + (R - C + this.data.offsetScaleY) * n) / C), M.b *= C, M.d *= C, g = !0
        }
        if (i > 0) {
          var y = M.b,
            w = M.d,
            I = Math.atan2(w, y),
            A = Math.atan2(l, s) - Math.atan2(h, o) - (I - Math.atan2(M.c, M.a));
          A > t.MathUtils.PI ? A -= t.MathUtils.PI2 : A < -t.MathUtils.PI && (A += t.MathUtils.PI2), A = I + (A + d) * i;
          var C = Math.sqrt(y * y + w * w);
          M.b = Math.cos(A) * C, M.d = Math.sin(A) * C, g = !0
        }
        g && (M.appliedValid = !1)
      }
    }, e.prototype.applyRelativeWorld = function () {
      for (var e = this.rotateMix, r = this.translateMix, n = this.scaleMix, i = this.shearMix, a = this.target, o = a.a, s = a.b, h = a.c, l = a.d, u = o * l - s * h > 0 ? t.MathUtils.degRad : -t.MathUtils.degRad, c = this.data.offsetRotation * u, d = this.data.offsetShearY * u, p = this.bones, f = 0, v = p.length; f < v; f++) {
        var M = p[f],
          g = !1;
        if (0 != e) {
          var m = M.a,
            y = M.b,
            x = M.c,
            w = M.d,
            A = Math.atan2(h, o) + c;
          A > t.MathUtils.PI ? A -= t.MathUtils.PI2 : A < -t.MathUtils.PI && (A += t.MathUtils.PI2), A *= e;
          var T = Math.cos(A),
            E = Math.sin(A);
          M.a = T * m - E * x, M.b = T * y - E * w, M.c = E * m + T * x, M.d = E * y + T * w, g = !0
        }
        if (0 != r) {
          var b = this.temp;
          a.localToWorld(b.set(this.data.offsetX, this.data.offsetY)), M.worldX += b.x * r, M.worldY += b.y * r, g = !0
        }
        if (n > 0) {
          var C = (Math.sqrt(o * o + h * h) - 1 + this.data.offsetScaleX) * n + 1;
          M.a *= C, M.c *= C, C = (Math.sqrt(s * s + l * l) - 1 + this.data.offsetScaleY) * n + 1, M.b *= C, M.d *= C, g = !0
        }
        if (i > 0) {
          var A = Math.atan2(l, s) - Math.atan2(h, o);
          A > t.MathUtils.PI ? A -= t.MathUtils.PI2 : A < -t.MathUtils.PI && (A += t.MathUtils.PI2);
          var y = M.b,
            w = M.d;
          A = Math.atan2(w, y) + (A - t.MathUtils.PI / 2 + d) * i;
          var C = Math.sqrt(y * y + w * w);
          M.b = Math.cos(A) * C, M.d = Math.sin(A) * C, g = !0
        }
        g && (M.appliedValid = !1)
      }
    }, e.prototype.applyAbsoluteLocal = function () {
      var t = this.rotateMix,
        e = this.translateMix,
        r = this.scaleMix,
        n = this.shearMix,
        i = this.target;
      i.appliedValid || i.updateAppliedTransform();
      for (var a = this.bones, o = 0, s = a.length; o < s; o++) {
        var h = a[o];
        h.appliedValid || h.updateAppliedTransform();
        var l = h.arotation;
        if (0 != t) {
          var u = i.arotation - l + this.data.offsetRotation;
          u -= 360 * (16384 - (16384.499999999996 - u / 360 | 0)), l += u * t
        }
        var c = h.ax,
          d = h.ay;
        0 != e && (c += (i.ax - c + this.data.offsetX) * e, d += (i.ay - d + this.data.offsetY) * e);
        var p = h.ascaleX,
          f = h.ascaleY;
        r > 0 && (p > 1e-5 && (p = (p + (i.ascaleX - p + this.data.offsetScaleX) * r) / p), f > 1e-5 && (f = (f + (i.ascaleY - f + this.data.offsetScaleY) * r) / f));
        var v = h.ashearY;
        if (n > 0) {
          var u = i.ashearY - v + this.data.offsetShearY;
          u -= 360 * (16384 - (16384.499999999996 - u / 360 | 0)), h.shearY += u * n
        }
        h.updateWorldTransformWith(c, d, l, p, f, h.ashearX, v)
      }
    }, e.prototype.applyRelativeLocal = function () {
      var t = this.rotateMix,
        e = this.translateMix,
        r = this.scaleMix,
        n = this.shearMix,
        i = this.target;
      i.appliedValid || i.updateAppliedTransform();
      for (var a = this.bones, o = 0, s = a.length; o < s; o++) {
        var h = a[o];
        h.appliedValid || h.updateAppliedTransform();
        var l = h.arotation;
        0 != t && (l += (i.arotation + this.data.offsetRotation) * t);
        var u = h.ax,
          c = h.ay;
        0 != e && (u += (i.ax + this.data.offsetX) * e, c += (i.ay + this.data.offsetY) * e);
        var d = h.ascaleX,
          p = h.ascaleY;
        r > 0 && (d > 1e-5 && (d *= (i.ascaleX - 1 + this.data.offsetScaleX) * r + 1), p > 1e-5 && (p *= (i.ascaleY - 1 + this.data.offsetScaleY) * r + 1));
        var f = h.ashearY;
        n > 0 && (f += (i.ashearY + this.data.offsetShearY) * n), h.updateWorldTransformWith(u, c, l, d, p, h.ashearX, f)
      }
    }, e.prototype.getOrder = function () {
      return this.data.order
    }, e
  }();
  t.TransformConstraint = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t(t) {
      if (this.order = 0, this.bones = new Array, this.rotateMix = 0, this.translateMix = 0, this.scaleMix = 0, this.shearMix = 0, this.offsetRotation = 0, this.offsetX = 0, this.offsetY = 0, this.offsetScaleX = 0, this.offsetScaleY = 0, this.offsetShearY = 0, this.relative = !1, this.local = !1, null == t) throw new Error("name cannot be null.");
      this.name = t
    }
    return t
  }();
  t.TransformConstraintData = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e() {
      this.convexPolygons = new Array, this.convexPolygonsIndices = new Array, this.indicesArray = new Array, this.isConcaveArray = new Array, this.triangles = new Array, this.polygonPool = new t.Pool(function () {
        return new Array
      }), this.polygonIndicesPool = new t.Pool(function () {
        return new Array
      })
    }
    return e.prototype.triangulate = function (t) {
      var r = t,
        n = t.length >> 1,
        i = this.indicesArray;
      i.length = 0;
      for (var a = 0; a < n; a++) i[a] = a;
      var o = this.isConcaveArray;
      o.length = 0;
      for (var a = 0, s = n; a < s; ++a) o[a] = e.isConcave(a, n, r, i);
      var h = this.triangles;
      for (h.length = 0; n > 3;) {
        for (var l = n - 1, a = 0, u = 1;;) {
          t: if (!o[a]) {
            for (var c = i[l] << 1, d = i[a] << 1, p = i[u] << 1, f = r[c], v = r[c + 1], M = r[d], g = r[d + 1], m = r[p], y = r[p + 1], x = (u + 1) % n; x != l; x = (x + 1) % n)
              if (o[x]) {
                var w = i[x] << 1,
                  A = r[w],
                  T = r[w + 1];
                if (e.positiveArea(m, y, f, v, A, T) && e.positiveArea(f, v, M, g, A, T) && e.positiveArea(M, g, m, y, A, T)) break t
              } break
          }if (0 == u) {
            do {
              if (!o[a]) break;
              a--
            } while (a > 0);
            break
          }
          l = a,
          a = u,
          u = (u + 1) % n
        }
        h.push(i[(n + a - 1) % n]), h.push(i[a]), h.push(i[(a + 1) % n]), i.splice(a, 1), o.splice(a, 1), n--;
        var E = (n + a - 1) % n,
          b = a == n ? 0 : a;
        o[E] = e.isConcave(E, n, r, i), o[b] = e.isConcave(b, n, r, i)
      }
      return 3 == n && (h.push(i[2]), h.push(i[0]), h.push(i[1])), h
    }, e.prototype.decompose = function (t, r) {
      var n = t,
        i = this.convexPolygons;
      this.polygonPool.freeAll(i), i.length = 0;
      var a = this.convexPolygonsIndices;
      this.polygonIndicesPool.freeAll(a), a.length = 0;
      var o = this.polygonIndicesPool.obtain();
      o.length = 0;
      var s = this.polygonPool.obtain();
      s.length = 0;
      for (var h = -1, l = 0, u = 0, c = r.length; u < c; u += 3) {
        var d = r[u] << 1,
          p = r[u + 1] << 1,
          f = r[u + 2] << 1,
          v = n[d],
          M = n[d + 1],
          g = n[p],
          m = n[p + 1],
          y = n[f],
          x = n[f + 1],
          w = !1;
        if (h == d) {
          var A = s.length - 4,
            T = e.winding(s[A], s[A + 1], s[A + 2], s[A + 3], y, x),
            E = e.winding(y, x, s[0], s[1], s[2], s[3]);
          T == l && E == l && (s.push(y), s.push(x), o.push(f), w = !0)
        }
        w || (s.length > 0 ? (i.push(s), a.push(o)) : (this.polygonPool.free(s), this.polygonIndicesPool.free(o)), s = this.polygonPool.obtain(), s.length = 0, s.push(v), s.push(M), s.push(g), s.push(m), s.push(y), s.push(x), o = this.polygonIndicesPool.obtain(), o.length = 0, o.push(d), o.push(p), o.push(f), l = e.winding(v, M, g, m, y, x), h = d)
      }
      s.length > 0 && (i.push(s), a.push(o));
      for (var u = 0, c = i.length; u < c; u++)
        if (o = a[u], 0 != o.length) {
          var b = o[0],
            C = o[o.length - 1];
          s = i[u];
          for (var A = s.length - 4, R = s[A], I = s[A + 1], S = s[A + 2], P = s[A + 3], V = s[0], F = s[1], L = s[2], _ = s[3], k = e.winding(R, I, S, P, V, F), N = 0; N < c; N++)
            if (N != u) {
              var D = a[N];
              if (3 == D.length) {
                var B = D[0],
                  U = D[1],
                  O = D[2],
                  X = i[N],
                  y = X[X.length - 2],
                  x = X[X.length - 1];
                if (B == b && U == C) {
                  var T = e.winding(R, I, S, P, y, x),
                    E = e.winding(y, x, V, F, L, _);
                  T == k && E == k && (X.length = 0, D.length = 0, s.push(y), s.push(x), o.push(O), R = S, I = P, S = y, P = x, N = 0)
                }
              }
            }
        } for (var u = i.length - 1; u >= 0; u--) s = i[u], 0 == s.length && (i.splice(u, 1), this.polygonPool.free(s), o = a[u], a.splice(u, 1), this.polygonIndicesPool.free(o));
      return i
    }, e.isConcave = function (t, e, r, n) {
      var i = n[(e + t - 1) % e] << 1,
        a = n[t] << 1,
        o = n[(t + 1) % e] << 1;
      return !this.positiveArea(r[i], r[i + 1], r[a], r[a + 1], r[o], r[o + 1])
    }, e.positiveArea = function (t, e, r, n, i, a) {
      return t * (a - n) + r * (e - a) + i * (n - e) >= 0
    }, e.winding = function (t, e, r, n, i, a) {
      var o = r - t,
        s = n - e;
      return i * s - a * o + o * e - t * s >= 0 ? 1 : -1
    }, e
  }();
  t.Triangulator = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function t() {
      this.array = new Array
    }
    return t.prototype.add = function (t) {
      var e = this.contains(t);
      return this.array[0 | t] = 0 | t, !e
    }, t.prototype.contains = function (t) {
      return void 0 != this.array[0 | t]
    }, t.prototype.remove = function (t) {
      this.array[0 | t] = void 0
    }, t.prototype.clear = function () {
      this.array.length = 0
    }, t
  }();
  t.IntSet = e;
  var r = function () {
    function t(t, e, r, n) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === r && (r = 0), void 0 === n && (n = 0), this.r = t, this.g = e, this.b = r, this.a = n
    }
    return t.prototype.set = function (t, e, r, n) {
      return this.r = t, this.g = e, this.b = r, this.a = n, this.clamp(), this
    }, t.prototype.setFromColor = function (t) {
      return this.r = t.r, this.g = t.g, this.b = t.b, this.a = t.a, this
    }, t.prototype.setFromString = function (t) {
      return t = "#" == t.charAt(0) ? t.substr(1) : t, this.r = parseInt(t.substr(0, 2), 16) / 255, this.g = parseInt(t.substr(2, 2), 16) / 255, this.b = parseInt(t.substr(4, 2), 16) / 255, this.a = (8 != t.length ? 255 : parseInt(t.substr(6, 2), 16)) / 255, this
    }, t.prototype.add = function (t, e, r, n) {
      return this.r += t, this.g += e, this.b += r, this.a += n, this.clamp(), this
    }, t.prototype.clamp = function () {
      return this.r < 0 ? this.r = 0 : this.r > 1 && (this.r = 1), this.g < 0 ? this.g = 0 : this.g > 1 && (this.g = 1), this.b < 0 ? this.b = 0 : this.b > 1 && (this.b = 1), this.a < 0 ? this.a = 0 : this.a > 1 && (this.a = 1), this
    }, t.WHITE = new t(1, 1, 1, 1), t.RED = new t(1, 0, 0, 1), t.GREEN = new t(0, 1, 0, 1), t.BLUE = new t(0, 0, 1, 1), t.MAGENTA = new t(1, 0, 1, 1), t
  }();
  t.Color = r;
  var n = function () {
    function t() {}
    return t.clamp = function (t, e, r) {
      return t < e ? e : t > r ? r : t
    }, t.cosDeg = function (e) {
      return Math.cos(e * t.degRad)
    }, t.sinDeg = function (e) {
      return Math.sin(e * t.degRad)
    }, t.signum = function (t) {
      return t > 0 ? 1 : t < 0 ? -1 : 0
    }, t.toInt = function (t) {
      return t > 0 ? Math.floor(t) : Math.ceil(t)
    }, t.cbrt = function (t) {
      var e = Math.pow(Math.abs(t), 1 / 3);
      return t < 0 ? -e : e
    }, t.randomTriangular = function (e, r) {
      return t.randomTriangularWith(e, r, .5 * (e + r))
    }, t.randomTriangularWith = function (t, e, r) {
      var n = Math.random(),
        i = e - t;
      return n <= (r - t) / i ? t + Math.sqrt(n * i * (r - t)) : e - Math.sqrt((1 - n) * i * (e - r))
    }, t.PI = 3.1415927, t.PI2 = 2 * t.PI, t.radiansToDegrees = 180 / t.PI, t.radDeg = t.radiansToDegrees, t.degreesToRadians = t.PI / 180, t.degRad = t.degreesToRadians, t
  }();
  t.MathUtils = n;
  var i = function () {
    function t() {}
    return t.prototype.apply = function (t, e, r) {
      return t + (e - t) * this.applyInternal(r)
    }, t
  }();
  t.Interpolation = i;
  var a = function (t) {
    function e(e) {
      var r = t.call(this) || this;
      return r.power = 2, r.power = e, r
    }
    return __extends(e, t), e.prototype.applyInternal = function (t) {
      return t <= .5 ? Math.pow(2 * t, this.power) / 2 : Math.pow(2 * (t - 1), this.power) / (this.power % 2 == 0 ? -2 : 2) + 1
    }, e
  }(i);
  t.Pow = a;
  var o = function (t) {
    function e(e) {
      return t.call(this, e) || this
    }
    return __extends(e, t), e.prototype.applyInternal = function (t) {
      return Math.pow(t - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1
    }, e
  }(a);
  t.PowOut = o;
  var s = function () {
    function t() {}
    return t.arrayCopy = function (t, e, r, n, i) {
      for (var a = e, o = n; a < e + i; a++, o++) r[o] = t[a]
    }, t.setArraySize = function (t, e, r) {
      void 0 === r && (r = 0);
      var n = t.length;
      if (n == e) return t;
      if (t.length = e, n < e)
        for (var i = n; i < e; i++) t[i] = r;
      return t
    }, t.ensureArrayCapacity = function (e, r, n) {
      return void 0 === n && (n = 0), e.length >= r ? e : t.setArraySize(e, r, n)
    }, t.newArray = function (t, e) {
      for (var r = new Array(t), n = 0; n < t; n++) r[n] = e;
      return r
    }, t.newFloatArray = function (e) {
      if (t.SUPPORTS_TYPED_ARRAYS) return new Float32Array(e);
      for (var r = new Array(e), n = 0; n < r.length; n++) r[n] = 0;
      return r
    }, t.newShortArray = function (e) {
      if (t.SUPPORTS_TYPED_ARRAYS) return new Int16Array(e);
      for (var r = new Array(e), n = 0; n < r.length; n++) r[n] = 0;
      return r
    }, t.toFloatArray = function (e) {
      return t.SUPPORTS_TYPED_ARRAYS ? new Float32Array(e) : e
    }, t.toSinglePrecision = function (e) {
      return t.SUPPORTS_TYPED_ARRAYS ? Math.fround(e) : e
    }, t.webkit602BugfixHelper = function (t, e) {}, t.SUPPORTS_TYPED_ARRAYS = "undefined" != typeof Float32Array, t
  }();
  t.Utils = s;
  var h = function () {
    function t() {}
    return t.logBones = function (t) {
      for (var e = 0; e < t.bones.length; e++) {
        var r = t.bones[e];
        console.log(r.data.name + ", " + r.a + ", " + r.b + ", " + r.c + ", " + r.d + ", " + r.worldX + ", " + r.worldY)
      }
    }, t
  }();
  t.DebugUtils = h;
  var l = function () {
    function t(t) {
      this.items = new Array, this.instantiator = t
    }
    return t.prototype.obtain = function () {
      return this.items.length > 0 ? this.items.pop() : this.instantiator()
    }, t.prototype.free = function (t) {
      t.reset && t.reset(), this.items.push(t)
    }, t.prototype.freeAll = function (t) {
      for (var e = 0; e < t.length; e++) t[e].reset && t[e].reset(), this.items[e] = t[e]
    }, t.prototype.clear = function () {
      this.items.length = 0
    }, t
  }();
  t.Pool = l;
  var u = function () {
    function t(t, e) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), this.x = t, this.y = e
    }
    return t.prototype.set = function (t, e) {
      return this.x = t, this.y = e, this
    }, t.prototype.length = function () {
      var t = this.x,
        e = this.y;
      return Math.sqrt(t * t + e * e)
    }, t.prototype.normalize = function () {
      var t = this.length();
      return 0 != t && (this.x /= t, this.y /= t), this
    }, t
  }();
  t.Vector2 = u;
  var c = function () {
    function t() {
      this.maxDelta = .064, this.framesPerSecond = 0, this.delta = 0, this.totalTime = 0, this.lastTime = Date.now() / 1e3, this.frameCount = 0, this.frameTime = 0
    }
    return t.prototype.update = function () {
      var t = Date.now() / 1e3;
      this.delta = t - this.lastTime, this.frameTime += this.delta, this.totalTime += this.delta, this.delta > this.maxDelta && (this.delta = this.maxDelta), this.lastTime = t, this.frameCount++, this.frameTime > 1 && (this.framesPerSecond = this.frameCount / this.frameTime, this.frameTime = 0, this.frameCount = 0)
    }, t
  }();
  t.TimeKeeper = c;
  var d = function () {
    function t(t) {
      void 0 === t && (t = 32), this.addedValues = 0, this.lastValue = 0, this.mean = 0, this.dirty = !0, this.values = new Array(t)
    }
    return t.prototype.hasEnoughData = function () {
      return this.addedValues >= this.values.length
    }, t.prototype.addValue = function (t) {
      this.addedValues < this.values.length && this.addedValues++, this.values[this.lastValue++] = t, this.lastValue > this.values.length - 1 && (this.lastValue = 0), this.dirty = !0
    }, t.prototype.getMean = function () {
      if (this.hasEnoughData()) {
        if (this.dirty) {
          for (var t = 0, e = 0; e < this.values.length; e++) t += this.values[e];
          this.mean = t / this.values.length, this.dirty = !1
        }
        return this.mean
      }
      return 0
    }, t
  }();
  t.WindowedMean = d
})(spine || (spine = {})),
function () {
  Math.fround || (Math.fround = function (t) {
    return function (e) {
      return t[0] = e, t[0]
    }
  }(new Float32Array(1)))
}();
var spine;
(function (t) {
  var e = function () {
    function t(t) {
      if (null == t) throw new Error("name cannot be null.");
      this.name = t
    }
    return t
  }();
  t.Attachment = e;
  var r = function (t) {
    function e(r) {
      var n = t.call(this, r) || this;
      return n.id = (65535 & e.nextID++) << 11, n.worldVerticesLength = 0, n
    }
    return __extends(e, t), e.prototype.computeWorldVertices = function (t, e, r, n, i, a) {
      r = i + (r >> 1) * a;
      var o = t.bone.skeleton,
        s = t.attachmentVertices,
        h = this.vertices,
        l = this.bones;
      if (null != l) {
        for (var u = 0, c = 0, d = 0; d < e; d += 2) {
          var p = l[u];
          u += p + 1, c += p
        }
        var f = o.bones;
        if (0 == s.length)
          for (var v = i, M = 3 * c; v < r; v += a) {
            var g = 0,
              m = 0,
              p = l[u++];
            for (p += u; u < p; u++, M += 3) {
              var y = f[l[u]],
                x = h[M],
                w = h[M + 1],
                A = h[M + 2];
              g += (x * y.a + w * y.b + y.worldX) * A, m += (x * y.c + w * y.d + y.worldY) * A
            }
            n[v] = g, n[v + 1] = m
          } else
            for (var T = s, v = i, M = 3 * c, E = c << 1; v < r; v += a) {
              var g = 0,
                m = 0,
                p = l[u++];
              for (p += u; u < p; u++, M += 3, E += 2) {
                var y = f[l[u]],
                  x = h[M] + T[E],
                  w = h[M + 1] + T[E + 1],
                  A = h[M + 2];
                g += (x * y.a + w * y.b + y.worldX) * A, m += (x * y.c + w * y.d + y.worldY) * A
              }
              n[v] = g, n[v + 1] = m
            }
      } else {
        s.length > 0 && (h = s);
        for (var y = t.bone, b = y.worldX, C = y.worldY, R = y.a, M = y.b, I = y.c, S = y.d, P = e, v = i; v < r; P += 2, v += a) {
          var x = h[P],
            w = h[P + 1];
          n[v] = x * R + w * M + b, n[v + 1] = x * I + w * S + C
        }
      }
    }, e.prototype.applyDeform = function (t) {
      return this == t
    }, e.nextID = 0, e
  }(e);
  t.VertexAttachment = r
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (t) {
    t[t.Region = 0] = "Region", t[t.BoundingBox = 1] = "BoundingBox",
      t[t.Mesh = 2] = "Mesh", t[t.LinkedMesh = 3] = "LinkedMesh", t[t.Path = 4] = "Path", t[t.Point = 5] = "Point", t[t.Clipping = 6] = "Clipping"
  })(e = t.AttachmentType || (t.AttachmentType = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function (e) {
    function r(r) {
      var n = e.call(this, r) || this;
      return n.color = new t.Color(1, 1, 1, 1), n
    }
    return __extends(r, e), r
  }(t.VertexAttachment);
  t.BoundingBoxAttachment = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function (e) {
    function r(r) {
      var n = e.call(this, r) || this;
      return n.color = new t.Color(.2275, .2275, .8078, 1), n
    }
    return __extends(r, e), r
  }(t.VertexAttachment);
  t.ClippingAttachment = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function (e) {
    function r(r) {
      var n = e.call(this, r) || this;
      return n.color = new t.Color(1, 1, 1, 1), n.inheritDeform = !1, n.tempColor = new t.Color(0, 0, 0, 0), n
    }
    return __extends(r, e), r.prototype.updateUVs = function () {
      var e = 0,
        r = 0,
        n = 0,
        i = 0;
      null == this.region ? (e = r = 0, n = i = 1) : (e = this.region.u, r = this.region.v, n = this.region.u2 - e, i = this.region.v2 - r);
      var a = this.regionUVs;
      null != this.uvs && this.uvs.length == a.length || (this.uvs = t.Utils.newFloatArray(a.length));
      var o = this.uvs;
      if (this.region.rotate)
        for (var s = 0, h = o.length; s < h; s += 2) o[s] = e + a[s + 1] * n, o[s + 1] = r + i - a[s] * i;
      else
        for (var s = 0, h = o.length; s < h; s += 2) o[s] = e + a[s] * n, o[s + 1] = r + a[s + 1] * i
    }, r.prototype.applyDeform = function (t) {
      return this == t || this.inheritDeform && this.parentMesh == t
    }, r.prototype.getParentMesh = function () {
      return this.parentMesh
    }, r.prototype.setParentMesh = function (t) {
      this.parentMesh = t, null != t && (this.bones = t.bones, this.vertices = t.vertices, this.worldVerticesLength = t.worldVerticesLength, this.regionUVs = t.regionUVs, this.triangles = t.triangles, this.hullLength = t.hullLength, this.worldVerticesLength = t.worldVerticesLength)
    }, r
  }(t.VertexAttachment);
  t.MeshAttachment = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function (e) {
    function r(r) {
      var n = e.call(this, r) || this;
      return n.closed = !1, n.constantSpeed = !1, n.color = new t.Color(1, 1, 1, 1), n
    }
    return __extends(r, e), r
  }(t.VertexAttachment);
  t.PathAttachment = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function (e) {
    function r(r) {
      var n = e.call(this, r) || this;
      return n.color = new t.Color(.38, .94, 0, 1), n
    }
    return __extends(r, e), r.prototype.computeWorldPosition = function (t, e) {
      return e.x = this.x * t.a + this.y * t.b + t.worldX, e.y = this.x * t.c + this.y * t.d + t.worldY, e
    }, r.prototype.computeWorldRotation = function (e) {
      var r = t.MathUtils.cosDeg(this.rotation),
        n = t.MathUtils.sinDeg(this.rotation),
        i = r * e.a + n * e.b,
        a = r * e.c + n * e.d;
      return Math.atan2(a, i) * t.MathUtils.radDeg
    }, r
  }(t.VertexAttachment);
  t.PointAttachment = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function (e) {
    function r(r) {
      var n = e.call(this, r) || this;
      return n.x = 0, n.y = 0, n.scaleX = 1, n.scaleY = 1, n.rotation = 0, n.width = 0, n.height = 0, n.color = new t.Color(1, 1, 1, 1), n.offset = t.Utils.newFloatArray(8), n.uvs = t.Utils.newFloatArray(8), n.tempColor = new t.Color(1, 1, 1, 1), n
    }
    return __extends(r, e), r.prototype.updateOffset = function () {
      var t = this.width / this.region.originalWidth * this.scaleX,
        e = this.height / this.region.originalHeight * this.scaleY,
        n = -this.width / 2 * this.scaleX + this.region.offsetX * t,
        i = -this.height / 2 * this.scaleY + this.region.offsetY * e,
        a = n + this.region.width * t,
        o = i + this.region.height * e,
        s = this.rotation * Math.PI / 180,
        h = Math.cos(s),
        l = Math.sin(s),
        u = n * h + this.x,
        c = n * l,
        d = i * h + this.y,
        p = i * l,
        f = a * h + this.x,
        v = a * l,
        M = o * h + this.y,
        g = o * l,
        m = this.offset;
      m[r.OX1] = u - p, m[r.OY1] = d + c, m[r.OX2] = u - g, m[r.OY2] = M + c, m[r.OX3] = f - g, m[r.OY3] = M + v, m[r.OX4] = f - p, m[r.OY4] = d + v
    }, r.prototype.setRegion = function (t) {
      this.region = t;
      var e = this.uvs;
      t.rotate ? (e[2] = t.u, e[3] = t.v2, e[4] = t.u, e[5] = t.v, e[6] = t.u2, e[7] = t.v, e[0] = t.u2, e[1] = t.v2) : (e[0] = t.u, e[1] = t.v2, e[2] = t.u, e[3] = t.v, e[4] = t.u2, e[5] = t.v, e[6] = t.u2, e[7] = t.v2)
    }, r.prototype.computeWorldVertices = function (t, e, n, i) {
      var a = this.offset,
        o = t.worldX,
        s = t.worldY,
        h = t.a,
        l = t.b,
        u = t.c,
        c = t.d,
        d = 0,
        p = 0;
      d = a[r.OX1], p = a[r.OY1], e[n] = d * h + p * l + o, e[n + 1] = d * u + p * c + s, n += i, d = a[r.OX2], p = a[r.OY2], e[n] = d * h + p * l + o, e[n + 1] = d * u + p * c + s, n += i, d = a[r.OX3], p = a[r.OY3], e[n] = d * h + p * l + o, e[n + 1] = d * u + p * c + s, n += i, d = a[r.OX4], p = a[r.OY4], e[n] = d * h + p * l + o, e[n + 1] = d * u + p * c + s
    }, r.OX1 = 0, r.OY1 = 1, r.OX2 = 2, r.OY2 = 3, r.OX3 = 4, r.OY3 = 5, r.OX4 = 6, r.OY4 = 7, r.X1 = 0, r.Y1 = 1, r.C1R = 2, r.C1G = 3, r.C1B = 4, r.C1A = 5, r.U1 = 6, r.V1 = 7, r.X2 = 8, r.Y2 = 9, r.C2R = 10, r.C2G = 11, r.C2B = 12, r.C2A = 13, r.U2 = 14, r.V2 = 15, r.X3 = 16, r.Y3 = 17, r.C3R = 18, r.C3G = 19, r.C3B = 20, r.C3A = 21, r.U3 = 22, r.V3 = 23, r.X4 = 24, r.Y4 = 25, r.C4R = 26, r.C4G = 27, r.C4B = 28, r.C4A = 29, r.U4 = 30, r.V4 = 31, r
  }(t.Attachment);
  t.RegionAttachment = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t, e) {
      this.jitterX = 0, this.jitterY = 0, this.jitterX = t, this.jitterY = e
    }
    return e.prototype.begin = function (t) {}, e.prototype.transform = function (e, r, n, i) {
      e.x += t.MathUtils.randomTriangular(-this.jitterX, this.jitterY), e.y += t.MathUtils.randomTriangular(-this.jitterX, this.jitterY)
    }, e.prototype.end = function () {}, e
  }();
  t.JitterEffect = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e = function () {
    function e(t) {
      this.centerX = 0, this.centerY = 0, this.radius = 0, this.angle = 0, this.worldX = 0, this.worldY = 0, this.radius = t
    }
    return e.prototype.begin = function (t) {
      this.worldX = t.x + this.centerX, this.worldY = t.y + this.centerY
    }, e.prototype.transform = function (r, n, i, a) {
      var o = this.angle * t.MathUtils.degreesToRadians,
        s = r.x - this.worldX,
        h = r.y - this.worldY,
        l = Math.sqrt(s * s + h * h);
      if (l < this.radius) {
        var u = e.interpolation.apply(0, o, (this.radius - l) / this.radius),
          c = Math.cos(u),
          d = Math.sin(u);
        r.x = c * s - d * h + this.worldX, r.y = d * s + c * h + this.worldY
      }
    }, e.prototype.end = function () {}, e.interpolation = new t.PowOut(2), e
  }();
  t.SwirlEffect = e
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function (e) {
      function r(r, n) {
        return void 0 === n && (n = ""), e.call(this, function (e) {
          return new t.webgl.GLTexture(r, e)
        }, n) || this
      }
      return __extends(r, e), r
    }(t.AssetManager);
    e.AssetManager = r
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (t) {
    var e = function () {
      function e(e, r) {
        this.position = new t.Vector3(0, 0, 0), this.direction = new t.Vector3(0, 0, -1), this.up = new t.Vector3(0, 1, 0), this.near = 0, this.far = 100, this.zoom = 1, this.viewportWidth = 0, this.viewportHeight = 0, this.projectionView = new t.Matrix4, this.inverseProjectionView = new t.Matrix4, this.projection = new t.Matrix4, this.view = new t.Matrix4, this.tmp = new t.Vector3, this.viewportWidth = e, this.viewportHeight = r, this.update()
      }
      return e.prototype.update = function () {
        var t = this.projection,
          e = this.view,
          r = this.projectionView,
          n = this.inverseProjectionView,
          i = this.zoom,
          a = this.viewportWidth,
          o = this.viewportHeight;
        t.ortho(i * (-a / 2), i * (a / 2), i * (-o / 2), i * (o / 2), this.near, this.far), e.lookAt(this.position, this.direction, this.up), r.set(t.values), r.multiply(e), n.set(r.values).invert()
      }, e.prototype.screenToWorld = function (t, e, r) {
        var n = t.x,
          i = r - t.y - 1,
          a = this.tmp;
        return a.x = 2 * n / e - 1, a.y = 2 * i / r - 1, a.z = 2 * t.z - 1, a.project(this.inverseProjectionView), t.set(a.x, a.y, a.z), t
      }, e.prototype.setViewport = function (t, e) {
        this.viewportWidth = t, this.viewportHeight = e
      }, e
    }();
    t.OrthoCamera = e
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function (t) {
      function r(r, n, i) {
        void 0 === i && (i = !1);
        var a = t.call(this, n) || this;
        return a.texture = null, a.boundUnit = 0, a.useMipMaps = !1, a.context = r instanceof e.ManagedWebGLRenderingContext ? r : new e.ManagedWebGLRenderingContext(r), a.useMipMaps = i, a.restore(), a.context.addRestorable(a), a
      }
      return __extends(r, t), r.prototype.setFilters = function (t, e) {
        var r = this.context.gl;
        this.bind(), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, t), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, e)
      }, r.prototype.setWraps = function (t, e) {
        var r = this.context.gl;
        this.bind(), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, t), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, e)
      }, r.prototype.update = function (t) {
        var e = this.context.gl;
        this.texture || (this.texture = this.context.gl.createTexture()), this.bind(), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, this._image), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, t ? e.LINEAR_MIPMAP_LINEAR : e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), t && e.generateMipmap(e.TEXTURE_2D)
      }, r.prototype.restore = function () {
        this.texture = null, this.update(this.useMipMaps)
      }, r.prototype.bind = function (t) {
        void 0 === t && (t = 0);
        var e = this.context.gl;
        this.boundUnit = t, e.activeTexture(e.TEXTURE0 + t), e.bindTexture(e.TEXTURE_2D, this.texture)
      }, r.prototype.unbind = function () {
        var t = this.context.gl;
        t.activeTexture(t.TEXTURE0 + this.boundUnit), t.bindTexture(t.TEXTURE_2D, null)
      }, r.prototype.dispose = function () {
        this.context.removeRestorable(this);
        var t = this.context.gl;
        t.deleteTexture(this.texture)
      }, r
    }(t.Texture);
    e.GLTexture = r
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function () {
      function e(e) {
        this.lastX = 0, this.lastY = 0, this.buttonDown = !1, this.currTouch = null, this.touchesPool = new t.Pool(function () {
          return new t.webgl.Touch(0, 0, 0)
        }), this.listeners = new Array, this.element = e, this.setupCallbacks(e)
      }
      return e.prototype.setupCallbacks = function (t) {
        var e = this;
        t.addEventListener("mousedown", function (r) {
          if (r instanceof MouseEvent) {
            for (var n = t.getBoundingClientRect(), i = r.clientX - n.left, a = r.clientY - n.top, o = e.listeners, s = 0; s < o.length; s++) o[s].down(i, a);
            e.lastX = i, e.lastY = a, e.buttonDown = !0
          }
        }, !0), t.addEventListener("mousemove", function (r) {
          if (r instanceof MouseEvent) {
            for (var n = t.getBoundingClientRect(), i = r.clientX - n.left, a = r.clientY - n.top, o = e.listeners, s = 0; s < o.length; s++) e.buttonDown ? o[s].dragged(i, a) : o[s].moved(i, a);
            e.lastX = i, e.lastY = a
          }
        }, !0), t.addEventListener("mouseup", function (r) {
          if (r instanceof MouseEvent) {
            for (var n = t.getBoundingClientRect(), i = r.clientX - n.left, a = r.clientY - n.top, o = e.listeners, s = 0; s < o.length; s++) o[s].up(i, a);
            e.lastX = i, e.lastY = a, e.buttonDown = !1
          }
        }, !0), t.addEventListener("touchstart", function (r) {
          if (null == e.currTouch) {
            for (var n = r.changedTouches, i = 0; i < n.length; i++) {
              var a = n[i],
                o = t.getBoundingClientRect(),
                s = a.clientX - o.left,
                h = a.clientY - o.top;
              e.currTouch = e.touchesPool.obtain(), e.currTouch.identifier = a.identifier, e.currTouch.x = s, e.currTouch.y = h;
              break
            }
            for (var l = e.listeners, u = 0; u < l.length; u++) l[u].down(e.currTouch.x, e.currTouch.y);
            console.log("Start " + e.currTouch.x + ", " + e.currTouch.y), e.lastX = e.currTouch.x, e.lastY = e.currTouch.y, e.buttonDown = !0, r.preventDefault()
          }
        }, !1), t.addEventListener("touchend", function (r) {
          for (var n = r.changedTouches, i = 0; i < n.length; i++) {
            var a = n[i];
            if (e.currTouch.identifier === a.identifier) {
              var o = t.getBoundingClientRect(),
                s = e.currTouch.x = a.clientX - o.left,
                h = e.currTouch.y = a.clientY - o.top;
              e.touchesPool.free(e.currTouch);
              for (var l = e.listeners, u = 0; u < l.length; u++) l[u].up(s, h);
              console.log("End " + s + ", " + h), e.lastX = s, e.lastY = h, e.buttonDown = !1, e.currTouch = null;
              break
            }
          }
          r.preventDefault()
        }, !1), t.addEventListener("touchcancel", function (r) {
          for (var n = r.changedTouches, i = 0; i < n.length; i++) {
            var a = n[i];
            if (e.currTouch.identifier === a.identifier) {
              var o = t.getBoundingClientRect(),
                s = e.currTouch.x = a.clientX - o.left,
                h = e.currTouch.y = a.clientY - o.top;
              e.touchesPool.free(e.currTouch);
              for (var l = e.listeners, u = 0; u < l.length; u++) l[u].up(s, h);
              console.log("End " + s + ", " + h), e.lastX = s, e.lastY = h, e.buttonDown = !1, e.currTouch = null;
              break
            }
          }
          r.preventDefault()
        }, !1), t.addEventListener("touchmove", function (r) {
          if (null != e.currTouch) {
            for (var n = r.changedTouches, i = 0; i < n.length; i++) {
              var a = n[i];
              if (e.currTouch.identifier === a.identifier) {
                for (var o = t.getBoundingClientRect(), s = a.clientX - o.left, h = a.clientY - o.top, l = e.listeners, u = 0; u < l.length; u++) l[u].dragged(s, h);
                console.log("Drag " + s + ", " + h), e.lastX = e.currTouch.x = s, e.lastY = e.currTouch.y = h;
                break
              }
            }
            r.preventDefault()
          }
        }, !1)
      }, e.prototype.addListener = function (t) {
        this.listeners.push(t)
      }, e.prototype.removeListener = function (t) {
        var e = this.listeners.indexOf(t);
        e > -1 && this.listeners.splice(e, 1)
      }, e
    }();
    e.Input = r;
    var n = function () {
      function t(t, e, r) {
        this.identifier = t, this.x = e, this.y = r
      }
      return t
    }();
    e.Touch = n
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function () {
      function r(e) {
        if (this.logo = null, this.spinner = null, this.angle = 0, this.fadeOut = 0, this.timeKeeper = new t.TimeKeeper, this.backgroundColor = new t.Color(.135, .135, .135, 1), this.tempColor = new t.Color, this.firstDraw = 0, this.renderer = e, this.timeKeeper.maxDelta = 9, null === r.logoImg) {
          var n = navigator.userAgent.indexOf("Safari") > -1;
          r.logoImg = new Image, r.logoImg.src = r.SPINE_LOGO_DATA, n || (r.logoImg.crossOrigin = "anonymous"), r.logoImg.onload = function (t) {
            r.loaded++
          }, r.spinnerImg = new Image, r.spinnerImg.src = r.SPINNER_DATA, n || (r.spinnerImg.crossOrigin = "anonymous"), r.spinnerImg.onload = function (t) {
            r.loaded++
          }
        }
      }
      return r.prototype.draw = function (t) {
        if (void 0 === t && (t = !1), !(t && this.fadeOut > r.FADE_SECONDS)) {
          this.timeKeeper.update();
          var n = Math.abs(Math.sin(this.timeKeeper.totalTime + .75));
          this.angle -= 360 * this.timeKeeper.delta * (1 + 1.5 * Math.pow(n, 5));
          var i = this.renderer,
            a = i.canvas,
            o = i.context.gl,
            s = i.camera.position.x,
            h = i.camera.position.y;
          if (i.camera.position.set(a.width / 2, a.height / 2, 0), i.camera.viewportWidth = a.width, i.camera.viewportHeight = a.height, i.resize(e.ResizeMode.Stretch), t) {
            if (this.fadeOut += this.timeKeeper.delta * (this.timeKeeper.totalTime < 1 ? 2 : 1), this.fadeOut > r.FADE_SECONDS) return void i.camera.position.set(s, h, 0);
            n = 1 - this.fadeOut / r.FADE_SECONDS, this.tempColor.setFromColor(this.backgroundColor), this.tempColor.a = 1 - (n - 1) * (n - 1), i.begin(), i.quad(!0, 0, 0, a.width, 0, a.width, a.height, 0, a.height, this.tempColor, this.tempColor, this.tempColor, this.tempColor), i.end()
          } else o.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a), o.clear(o.COLOR_BUFFER_BIT), this.tempColor.a = 1;
          if (this.tempColor.set(1, 1, 1, this.tempColor.a), 2 == r.loaded) {
            null === this.logo && (this.logo = new e.GLTexture(i.context, r.logoImg), this.spinner = new e.GLTexture(i.context, r.spinnerImg)), this.logo.update(!1), this.spinner.update(!1);
            var l = this.logo.getImage().width,
              u = this.logo.getImage().height,
              c = this.spinner.getImage().width,
              d = this.spinner.getImage().height;
            i.batcher.setBlendMode(o.SRC_ALPHA, o.ONE_MINUS_SRC_ALPHA), i.begin(), i.drawTexture(this.logo, (a.width - l) / 2, (a.height - u) / 2, l, u, this.tempColor), i.drawTextureRotated(this.spinner, (a.width - c) / 2, (a.height - d) / 2, c, d, c / 2, d / 2, this.angle, this.tempColor), i.end(), i.camera.position.set(s, h, 0)
          }
        }
      }, r.FADE_SECONDS = 1, r.loaded = 0, r.spinnerImg = null, r.logoImg = null, r.SPINNER_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAChCAMAAAB3TUS6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYNQTFRFAAAA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AA/0AAkTDRyAAAAIB0Uk5TAAABAgMEBQYHCAkKCwwODxAREhMUFRYXGBkaHB0eICEiIyQlJicoKSorLC0uLzAxMjM0Nzg5Ojs8PT4/QEFDRUlKS0xNTk9QUlRWWFlbXF1eYWJjZmhscHF0d3h5e3x+f4CIiYuMj5GSlJWXm56io6arr7rAxcjO0dXe6Onr8fmb5sOOAAADuElEQVQYGe3B+3vTVBwH4M/3nCRt13br2Lozhug2q25gYQubcxqVKYoMCYoKjEsUdSpeiBc0Kl7yp9t2za39pely7PF5zvuiQKc+/e2f8K+f9g2oyQ77Ag4VGX+HketQ0XYYe0JQ0CdhogwF+WFiBgr6JkxUoKCDMMGgoP0w9gdUtB3GfoCKVsPYAVQ0H8YuQUWVMHYGKuJhrAklPQkjJpT0bdj3O9S0FfZ9ADXxP8MjVSiqFfa8B2VVV8+df14QtB4iwn+BpuZEgyM38WMQHDYhnbkgukrIh5ygZ48glyn6KshlL+jbhVRcxCzk0ApiC5CI5kVsgTAy9jiI/WxBGmqIFBMjqwYphwRZaiLNwsjqQdoVSFISGRwjM4OMFUjBRcYCYWT0XZD2SwUS0LzIKCGH2SDja0LxKiJjCrm0gowVFI6aIs1CTouPg5QvUTgSKXMMuVUeBSmEopFITBPGwO8HCYbCTYtImTAWejuI3CMUjmZFT5NjbM/9GvQcMkhADdFRIxxD7aug4wGDFGSVTcLx0MzutQ2CpmmapmmapmmapmmapmmaphWBmGFV6rNNcaLC0GUuv3LROftUo8wJk0a10207sVED6IIf+9673LIwQeW2PaCEJX/A+xYmhTbtQUu46g96SJgQZg9Zwxf+EAMTwuwhm3jkD7EwIdweBn+YhQlh9pA2HvpDTEwIs4es4GN/CMekNOxBJ9D2B10nTAyfW7fT1hjYgZ/xYIUwUcycaiwuv2h3tOcZADr7ud/12c0ru2cWSwQ1UAcixIgImqZpmqZpmqZpmqZpmqZp2v8HMSIcF186t8oghbnlOJt1wnHwl7yOGxwSlHacrjWG8dVuej03OApn7jhHtiyMiZa9yD6haLYTebWOsbDXvQRHwchJWSTkV/rQS+EoWttJaTHkJe56KXcJRZt20jY48nnBy9hE4WjLSbvAkIfwMm5zFG/KyWgRRke3vYwGZDjpZHCMruJltCAFrTtpVYxu1ktzCHKwbSdlGqOreynXGGQpOylljI5uebFbBuSZc2IbhBxmvcj9GiSiZ52+HQO5nPb6TkIqajs9L5eQk7jnddxZgGT0jNOxYSI36+Kdj9oG5OPV6QpB6yJuGAYnqIrecLveYlDUKffIOtREl90+BiWV3cgMlNR0I09DSS030oaSttzILpT0phu5BBWRmyAoiLkJgoIMN8GgoJKb4FBQzU0YUFDdTRhQUNVNcCjIdBMEBdE7buQ8lFRz+97lUFN5fe+qu//aMkeB/gU2ae9y2HgbngAAAABJRU5ErkJggg==", r.SPINE_LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAZCAYAAACis3k0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtNJREFUaN7tmT2I1EAUxwN+oWgRT0HFKo0WCkJ6ObmAWFwZbCxsXGysLNJaiCyIoDaSwk4ETzvhmnBaCRbBWoQ01ho4PwotjP8cE337mMy8TLK757mBH3fLTWbe/PbN53neNniqZW8FvAVvQAqugwvgDDgO9niLRyTyJagM/ACPF6bsIl9ZRDac/Cc6tLn5xQdRQ496QlKPLxD5QCDxO9jtGM8QfYoIgUlgCipGCRJL5VvlyOdCU09iEXkCfLSIfCrs7Fab6nOsiafu06iDwES9w/uU1QnDC+ekkVS9vEaDsgVeB0d+z1VDtOGxRaYPboP3Gokb4GgXkZp4chZPJKgvZ3U0XkriK/TIt9YUDllFgTAjGwoaoHqfBhMI58yD4BQ4V6/aHYdfxToftvw9F2SiVroawU2/Cv5C4Thv0KB9S5nxlOd4STxjwUjzSdYlgrYijw2BsEfgsaFcM09lhiys94xXQQwugcvgJrgFLjrEE7WUiTuWCQzt/ZXN7FfqGwuGClyVy2xZAFmfDQvNtwFFSspMDGsD+UTWqu1KoVmVooFEJgKRXw0if85RpISEzwsjzeqWzkjkC4PIJ3MUmQgITAHlQwTFhnZhELkEntfZRwR+AvfAgXmJHOqU02XligWT8ppg67NXbdCXeq7afUQ6L8C2DalEZNt2YyQ94Qy8/ekjMpBMbfyl5iTjG7YAI8cNecROAb4kJmTjaXAF3AGvwQewOiuRxEtlSaT4j2h2lMsUueQEoMlIKpTvAmKhxPMtC876jEX6rE8l8TNx/KVbn6xlWU9NWcSDUsO4NGWpQOTZFpHPOooMXcswmW2XFk3ixb2v0Nq+XVKP00QNaffBLyWwBI/AkTlfMYZDXMf12kc6yjwEjoFdO/5me5oi/6tnyhlZX6OtgmX1c2Uh0k3khmbB2b9TRfpd/jfTUeRDJvHdYg5wE7kPXAN3wQ1weDvH+xufEgpi5qIl3QAAAABJRU5ErkJggg==", r
    }();
    e.LoadingScreen = r
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (t) {
    t.M00 = 0, t.M01 = 4, t.M02 = 8, t.M03 = 12, t.M10 = 1, t.M11 = 5, t.M12 = 9, t.M13 = 13, t.M20 = 2, t.M21 = 6, t.M22 = 10, t.M23 = 14, t.M30 = 3, t.M31 = 7, t.M32 = 11, t.M33 = 15;
    var e = function () {
      function e() {
        this.temp = new Float32Array(16), this.values = new Float32Array(16);
        var e = this.values;
        e[t.M00] = 1, e[t.M11] = 1, e[t.M22] = 1, e[t.M33] = 1
      }
      return e.prototype.set = function (t) {
        return this.values.set(t), this
      }, e.prototype.transpose = function () {
        var e = this.temp,
          r = this.values;
        return e[t.M00] = r[t.M00], e[t.M01] = r[t.M10], e[t.M02] = r[t.M20], e[t.M03] = r[t.M30], e[t.M10] = r[t.M01], e[t.M11] = r[t.M11], e[t.M12] = r[t.M21], e[t.M13] = r[t.M31], e[t.M20] = r[t.M02], e[t.M21] = r[t.M12], e[t.M22] = r[t.M22], e[t.M23] = r[t.M32], e[t.M30] = r[t.M03], e[t.M31] = r[t.M13], e[t.M32] = r[t.M23], e[t.M33] = r[t.M33], this.set(e)
      }, e.prototype.identity = function () {
        var e = this.values;
        return e[t.M00] = 1, e[t.M01] = 0, e[t.M02] = 0, e[t.M03] = 0, e[t.M10] = 0, e[t.M11] = 1, e[t.M12] = 0, e[t.M13] = 0, e[t.M20] = 0, e[t.M21] = 0, e[t.M22] = 1, e[t.M23] = 0, e[t.M30] = 0, e[t.M31] = 0, e[t.M32] = 0, e[t.M33] = 1, this
      }, e.prototype.invert = function () {
        var e = this.values,
          r = this.temp,
          n = e[t.M30] * e[t.M21] * e[t.M12] * e[t.M03] - e[t.M20] * e[t.M31] * e[t.M12] * e[t.M03] - e[t.M30] * e[t.M11] * e[t.M22] * e[t.M03] + e[t.M10] * e[t.M31] * e[t.M22] * e[t.M03] + e[t.M20] * e[t.M11] * e[t.M32] * e[t.M03] - e[t.M10] * e[t.M21] * e[t.M32] * e[t.M03] - e[t.M30] * e[t.M21] * e[t.M02] * e[t.M13] + e[t.M20] * e[t.M31] * e[t.M02] * e[t.M13] + e[t.M30] * e[t.M01] * e[t.M22] * e[t.M13] - e[t.M00] * e[t.M31] * e[t.M22] * e[t.M13] - e[t.M20] * e[t.M01] * e[t.M32] * e[t.M13] + e[t.M00] * e[t.M21] * e[t.M32] * e[t.M13] + e[t.M30] * e[t.M11] * e[t.M02] * e[t.M23] - e[t.M10] * e[t.M31] * e[t.M02] * e[t.M23] - e[t.M30] * e[t.M01] * e[t.M12] * e[t.M23] + e[t.M00] * e[t.M31] * e[t.M12] * e[t.M23] + e[t.M10] * e[t.M01] * e[t.M32] * e[t.M23] - e[t.M00] * e[t.M11] * e[t.M32] * e[t.M23] - e[t.M20] * e[t.M11] * e[t.M02] * e[t.M33] + e[t.M10] * e[t.M21] * e[t.M02] * e[t.M33] + e[t.M20] * e[t.M01] * e[t.M12] * e[t.M33] - e[t.M00] * e[t.M21] * e[t.M12] * e[t.M33] - e[t.M10] * e[t.M01] * e[t.M22] * e[t.M33] + e[t.M00] * e[t.M11] * e[t.M22] * e[t.M33];
        if (0 == n) throw new Error("non-invertible matrix");
        var i = 1 / n;
        return r[t.M00] = e[t.M12] * e[t.M23] * e[t.M31] - e[t.M13] * e[t.M22] * e[t.M31] + e[t.M13] * e[t.M21] * e[t.M32] - e[t.M11] * e[t.M23] * e[t.M32] - e[t.M12] * e[t.M21] * e[t.M33] + e[t.M11] * e[t.M22] * e[t.M33], r[t.M01] = e[t.M03] * e[t.M22] * e[t.M31] - e[t.M02] * e[t.M23] * e[t.M31] - e[t.M03] * e[t.M21] * e[t.M32] + e[t.M01] * e[t.M23] * e[t.M32] + e[t.M02] * e[t.M21] * e[t.M33] - e[t.M01] * e[t.M22] * e[t.M33], r[t.M02] = e[t.M02] * e[t.M13] * e[t.M31] - e[t.M03] * e[t.M12] * e[t.M31] + e[t.M03] * e[t.M11] * e[t.M32] - e[t.M01] * e[t.M13] * e[t.M32] - e[t.M02] * e[t.M11] * e[t.M33] + e[t.M01] * e[t.M12] * e[t.M33], r[t.M03] = e[t.M03] * e[t.M12] * e[t.M21] - e[t.M02] * e[t.M13] * e[t.M21] - e[t.M03] * e[t.M11] * e[t.M22] + e[t.M01] * e[t.M13] * e[t.M22] + e[t.M02] * e[t.M11] * e[t.M23] - e[t.M01] * e[t.M12] * e[t.M23], r[t.M10] = e[t.M13] * e[t.M22] * e[t.M30] - e[t.M12] * e[t.M23] * e[t.M30] - e[t.M13] * e[t.M20] * e[t.M32] + e[t.M10] * e[t.M23] * e[t.M32] + e[t.M12] * e[t.M20] * e[t.M33] - e[t.M10] * e[t.M22] * e[t.M33], r[t.M11] = e[t.M02] * e[t.M23] * e[t.M30] - e[t.M03] * e[t.M22] * e[t.M30] + e[t.M03] * e[t.M20] * e[t.M32] - e[t.M00] * e[t.M23] * e[t.M32] - e[t.M02] * e[t.M20] * e[t.M33] + e[t.M00] * e[t.M22] * e[t.M33], r[t.M12] = e[t.M03] * e[t.M12] * e[t.M30] - e[t.M02] * e[t.M13] * e[t.M30] - e[t.M03] * e[t.M10] * e[t.M32] + e[t.M00] * e[t.M13] * e[t.M32] + e[t.M02] * e[t.M10] * e[t.M33] - e[t.M00] * e[t.M12] * e[t.M33], r[t.M13] = e[t.M02] * e[t.M13] * e[t.M20] - e[t.M03] * e[t.M12] * e[t.M20] + e[t.M03] * e[t.M10] * e[t.M22] - e[t.M00] * e[t.M13] * e[t.M22] - e[t.M02] * e[t.M10] * e[t.M23] + e[t.M00] * e[t.M12] * e[t.M23], r[t.M20] = e[t.M11] * e[t.M23] * e[t.M30] - e[t.M13] * e[t.M21] * e[t.M30] + e[t.M13] * e[t.M20] * e[t.M31] - e[t.M10] * e[t.M23] * e[t.M31] - e[t.M11] * e[t.M20] * e[t.M33] + e[t.M10] * e[t.M21] * e[t.M33], r[t.M21] = e[t.M03] * e[t.M21] * e[t.M30] - e[t.M01] * e[t.M23] * e[t.M30] - e[t.M03] * e[t.M20] * e[t.M31] + e[t.M00] * e[t.M23] * e[t.M31] + e[t.M01] * e[t.M20] * e[t.M33] - e[t.M00] * e[t.M21] * e[t.M33], r[t.M22] = e[t.M01] * e[t.M13] * e[t.M30] - e[t.M03] * e[t.M11] * e[t.M30] + e[t.M03] * e[t.M10] * e[t.M31] - e[t.M00] * e[t.M13] * e[t.M31] - e[t.M01] * e[t.M10] * e[t.M33] + e[t.M00] * e[t.M11] * e[t.M33], r[t.M23] = e[t.M03] * e[t.M11] * e[t.M20] - e[t.M01] * e[t.M13] * e[t.M20] - e[t.M03] * e[t.M10] * e[t.M21] + e[t.M00] * e[t.M13] * e[t.M21] + e[t.M01] * e[t.M10] * e[t.M23] - e[t.M00] * e[t.M11] * e[t.M23], r[t.M30] = e[t.M12] * e[t.M21] * e[t.M30] - e[t.M11] * e[t.M22] * e[t.M30] - e[t.M12] * e[t.M20] * e[t.M31] + e[t.M10] * e[t.M22] * e[t.M31] + e[t.M11] * e[t.M20] * e[t.M32] - e[t.M10] * e[t.M21] * e[t.M32], r[t.M31] = e[t.M01] * e[t.M22] * e[t.M30] - e[t.M02] * e[t.M21] * e[t.M30] + e[t.M02] * e[t.M20] * e[t.M31] - e[t.M00] * e[t.M22] * e[t.M31] - e[t.M01] * e[t.M20] * e[t.M32] + e[t.M00] * e[t.M21] * e[t.M32], r[t.M32] = e[t.M02] * e[t.M11] * e[t.M30] - e[t.M01] * e[t.M12] * e[t.M30] - e[t.M02] * e[t.M10] * e[t.M31] + e[t.M00] * e[t.M12] * e[t.M31] + e[t.M01] * e[t.M10] * e[t.M32] - e[t.M00] * e[t.M11] * e[t.M32], r[t.M33] = e[t.M01] * e[t.M12] * e[t.M20] - e[t.M02] * e[t.M11] * e[t.M20] + e[t.M02] * e[t.M10] * e[t.M21] - e[t.M00] * e[t.M12] * e[t.M21] - e[t.M01] * e[t.M10] * e[t.M22] + e[t.M00] * e[t.M11] * e[t.M22], e[t.M00] = r[t.M00] * i, e[t.M01] = r[t.M01] * i, e[t.M02] = r[t.M02] * i, e[t.M03] = r[t.M03] * i, e[t.M10] = r[t.M10] * i, e[t.M11] = r[t.M11] * i, e[t.M12] = r[t.M12] * i, e[t.M13] = r[t.M13] * i, e[t.M20] = r[t.M20] * i, e[t.M21] = r[t.M21] * i, e[t.M22] = r[t.M22] * i, e[t.M23] = r[t.M23] * i, e[t.M30] = r[t.M30] * i, e[t.M31] = r[t.M31] * i, e[t.M32] = r[t.M32] * i, e[t.M33] = r[t.M33] * i, this
      }, e.prototype.determinant = function () {
        var e = this.values;
        return e[t.M30] * e[t.M21] * e[t.M12] * e[t.M03] - e[t.M20] * e[t.M31] * e[t.M12] * e[t.M03] - e[t.M30] * e[t.M11] * e[t.M22] * e[t.M03] + e[t.M10] * e[t.M31] * e[t.M22] * e[t.M03] + e[t.M20] * e[t.M11] * e[t.M32] * e[t.M03] - e[t.M10] * e[t.M21] * e[t.M32] * e[t.M03] - e[t.M30] * e[t.M21] * e[t.M02] * e[t.M13] + e[t.M20] * e[t.M31] * e[t.M02] * e[t.M13] + e[t.M30] * e[t.M01] * e[t.M22] * e[t.M13] - e[t.M00] * e[t.M31] * e[t.M22] * e[t.M13] - e[t.M20] * e[t.M01] * e[t.M32] * e[t.M13] + e[t.M00] * e[t.M21] * e[t.M32] * e[t.M13] + e[t.M30] * e[t.M11] * e[t.M02] * e[t.M23] - e[t.M10] * e[t.M31] * e[t.M02] * e[t.M23] - e[t.M30] * e[t.M01] * e[t.M12] * e[t.M23] + e[t.M00] * e[t.M31] * e[t.M12] * e[t.M23] + e[t.M10] * e[t.M01] * e[t.M32] * e[t.M23] - e[t.M00] * e[t.M11] * e[t.M32] * e[t.M23] - e[t.M20] * e[t.M11] * e[t.M02] * e[t.M33] + e[t.M10] * e[t.M21] * e[t.M02] * e[t.M33] + e[t.M20] * e[t.M01] * e[t.M12] * e[t.M33] - e[t.M00] * e[t.M21] * e[t.M12] * e[t.M33] - e[t.M10] * e[t.M01] * e[t.M22] * e[t.M33] + e[t.M00] * e[t.M11] * e[t.M22] * e[t.M33]
      }, e.prototype.translate = function (e, r, n) {
        var i = this.values;
        return i[t.M03] += e, i[t.M13] += r, i[t.M23] += n, this
      }, e.prototype.copy = function () {
        return (new e).set(this.values)
      }, e.prototype.projection = function (e, r, n, i) {
        this.identity();
        var a = 1 / Math.tan(n * (Math.PI / 180) / 2),
          o = (r + e) / (e - r),
          s = 2 * r * e / (e - r),
          h = this.values;
        return h[t.M00] = a / i, h[t.M10] = 0, h[t.M20] = 0, h[t.M30] = 0, h[t.M01] = 0, h[t.M11] = a, h[t.M21] = 0, h[t.M31] = 0, h[t.M02] = 0, h[t.M12] = 0, h[t.M22] = o, h[t.M32] = -1, h[t.M03] = 0, h[t.M13] = 0, h[t.M23] = s, h[t.M33] = 0, this
      }, e.prototype.ortho2d = function (t, e, r, n) {
        return this.ortho(t, t + r, e, e + n, 0, 1)
      }, e.prototype.ortho = function (e, r, n, i, a, o) {
        this.identity();
        var s = 2 / (r - e),
          h = 2 / (i - n),
          l = -2 / (o - a),
          u = -(r + e) / (r - e),
          c = -(i + n) / (i - n),
          d = -(o + a) / (o - a),
          p = this.values;
        return p[t.M00] = s, p[t.M10] = 0, p[t.M20] = 0, p[t.M30] = 0, p[t.M01] = 0, p[t.M11] = h, p[t.M21] = 0, p[t.M31] = 0, p[t.M02] = 0, p[t.M12] = 0, p[t.M22] = l, p[t.M32] = 0, p[t.M03] = u, p[t.M13] = c, p[t.M23] = d, p[t.M33] = 1, this
      }, e.prototype.multiply = function (e) {
        var r = this.temp,
          n = this.values,
          i = e.values;
        return r[t.M00] = n[t.M00] * i[t.M00] + n[t.M01] * i[t.M10] + n[t.M02] * i[t.M20] + n[t.M03] * i[t.M30], r[t.M01] = n[t.M00] * i[t.M01] + n[t.M01] * i[t.M11] + n[t.M02] * i[t.M21] + n[t.M03] * i[t.M31], r[t.M02] = n[t.M00] * i[t.M02] + n[t.M01] * i[t.M12] + n[t.M02] * i[t.M22] + n[t.M03] * i[t.M32], r[t.M03] = n[t.M00] * i[t.M03] + n[t.M01] * i[t.M13] + n[t.M02] * i[t.M23] + n[t.M03] * i[t.M33], r[t.M10] = n[t.M10] * i[t.M00] + n[t.M11] * i[t.M10] + n[t.M12] * i[t.M20] + n[t.M13] * i[t.M30], r[t.M11] = n[t.M10] * i[t.M01] + n[t.M11] * i[t.M11] + n[t.M12] * i[t.M21] + n[t.M13] * i[t.M31], r[t.M12] = n[t.M10] * i[t.M02] + n[t.M11] * i[t.M12] + n[t.M12] * i[t.M22] + n[t.M13] * i[t.M32], r[t.M13] = n[t.M10] * i[t.M03] + n[t.M11] * i[t.M13] + n[t.M12] * i[t.M23] + n[t.M13] * i[t.M33], r[t.M20] = n[t.M20] * i[t.M00] + n[t.M21] * i[t.M10] + n[t.M22] * i[t.M20] + n[t.M23] * i[t.M30], r[t.M21] = n[t.M20] * i[t.M01] + n[t.M21] * i[t.M11] + n[t.M22] * i[t.M21] + n[t.M23] * i[t.M31], r[t.M22] = n[t.M20] * i[t.M02] + n[t.M21] * i[t.M12] + n[t.M22] * i[t.M22] + n[t.M23] * i[t.M32], r[t.M23] = n[t.M20] * i[t.M03] + n[t.M21] * i[t.M13] + n[t.M22] * i[t.M23] + n[t.M23] * i[t.M33], r[t.M30] = n[t.M30] * i[t.M00] + n[t.M31] * i[t.M10] + n[t.M32] * i[t.M20] + n[t.M33] * i[t.M30], r[t.M31] = n[t.M30] * i[t.M01] + n[t.M31] * i[t.M11] + n[t.M32] * i[t.M21] + n[t.M33] * i[t.M31], r[t.M32] = n[t.M30] * i[t.M02] + n[t.M31] * i[t.M12] + n[t.M32] * i[t.M22] + n[t.M33] * i[t.M32], r[t.M33] = n[t.M30] * i[t.M03] + n[t.M31] * i[t.M13] + n[t.M32] * i[t.M23] + n[t.M33] * i[t.M33], this.set(this.temp)
      }, e.prototype.multiplyLeft = function (e) {
        var r = this.temp,
          n = this.values,
          i = e.values;
        return r[t.M00] = i[t.M00] * n[t.M00] + i[t.M01] * n[t.M10] + i[t.M02] * n[t.M20] + i[t.M03] * n[t.M30], r[t.M01] = i[t.M00] * n[t.M01] + i[t.M01] * n[t.M11] + i[t.M02] * n[t.M21] + i[t.M03] * n[t.M31], r[t.M02] = i[t.M00] * n[t.M02] + i[t.M01] * n[t.M12] + i[t.M02] * n[t.M22] + i[t.M03] * n[t.M32], r[t.M03] = i[t.M00] * n[t.M03] + i[t.M01] * n[t.M13] + i[t.M02] * n[t.M23] + i[t.M03] * n[t.M33], r[t.M10] = i[t.M10] * n[t.M00] + i[t.M11] * n[t.M10] + i[t.M12] * n[t.M20] + i[t.M13] * n[t.M30], r[t.M11] = i[t.M10] * n[t.M01] + i[t.M11] * n[t.M11] + i[t.M12] * n[t.M21] + i[t.M13] * n[t.M31], r[t.M12] = i[t.M10] * n[t.M02] + i[t.M11] * n[t.M12] + i[t.M12] * n[t.M22] + i[t.M13] * n[t.M32], r[t.M13] = i[t.M10] * n[t.M03] + i[t.M11] * n[t.M13] + i[t.M12] * n[t.M23] + i[t.M13] * n[t.M33], r[t.M20] = i[t.M20] * n[t.M00] + i[t.M21] * n[t.M10] + i[t.M22] * n[t.M20] + i[t.M23] * n[t.M30], r[t.M21] = i[t.M20] * n[t.M01] + i[t.M21] * n[t.M11] + i[t.M22] * n[t.M21] + i[t.M23] * n[t.M31], r[t.M22] = i[t.M20] * n[t.M02] + i[t.M21] * n[t.M12] + i[t.M22] * n[t.M22] + i[t.M23] * n[t.M32], r[t.M23] = i[t.M20] * n[t.M03] + i[t.M21] * n[t.M13] + i[t.M22] * n[t.M23] + i[t.M23] * n[t.M33], r[t.M30] = i[t.M30] * n[t.M00] + i[t.M31] * n[t.M10] + i[t.M32] * n[t.M20] + i[t.M33] * n[t.M30], r[t.M31] = i[t.M30] * n[t.M01] + i[t.M31] * n[t.M11] + i[t.M32] * n[t.M21] + i[t.M33] * n[t.M31], r[t.M32] = i[t.M30] * n[t.M02] + i[t.M31] * n[t.M12] + i[t.M32] * n[t.M22] + i[t.M33] * n[t.M32], r[t.M33] = i[t.M30] * n[t.M03] + i[t.M31] * n[t.M13] + i[t.M32] * n[t.M23] + i[t.M33] * n[t.M33], this.set(this.temp)
      }, e.prototype.lookAt = function (r, n, i) {
        e.initTemps();
        var a = e.xAxis,
          o = e.yAxis,
          s = e.zAxis;
        s.setFrom(n).normalize(), a.setFrom(n).normalize(), a.cross(i).normalize(), o.setFrom(a).cross(s).normalize(), this.identity();
        var h = this.values;
        return h[t.M00] = a.x, h[t.M01] = a.y, h[t.M02] = a.z, h[t.M10] = o.x, h[t.M11] = o.y, h[t.M12] = o.z, h[t.M20] = -s.x, h[t.M21] = -s.y, h[t.M22] = -s.z, e.tmpMatrix.identity(), e.tmpMatrix.values[t.M03] = -r.x, e.tmpMatrix.values[t.M13] = -r.y, e.tmpMatrix.values[t.M23] = -r.z, this.multiply(e.tmpMatrix), this
      }, e.initTemps = function () {
        null === e.xAxis && (e.xAxis = new t.Vector3), null === e.yAxis && (e.yAxis = new t.Vector3), null === e.zAxis && (e.zAxis = new t.Vector3)
      }, e.xAxis = null, e.yAxis = null, e.zAxis = null, e.tmpMatrix = new e, e
    }();
    t.Matrix4 = e
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (t) {
    var e = function () {
      function e(e, r, n, i) {
        this.attributes = r, this.verticesLength = 0, this.dirtyVertices = !1, this.indicesLength = 0, this.dirtyIndices = !1, this.elementsPerVertex = 0, this.context = e instanceof t.ManagedWebGLRenderingContext ? e : new t.ManagedWebGLRenderingContext(e), this.elementsPerVertex = 0;
        for (var a = 0; a < r.length; a++) this.elementsPerVertex += r[a].numElements;
        this.vertices = new Float32Array(n * this.elementsPerVertex), this.indices = new Uint16Array(i), this.context.addRestorable(this)
      }
      return e.prototype.getAttributes = function () {
        return this.attributes
      }, e.prototype.maxVertices = function () {
        return this.vertices.length / this.elementsPerVertex
      }, e.prototype.numVertices = function () {
        return this.verticesLength / this.elementsPerVertex
      }, e.prototype.setVerticesLength = function (t) {
        this.dirtyVertices = !0, this.verticesLength = t
      }, e.prototype.getVertices = function () {
        return this.vertices
      }, e.prototype.maxIndices = function () {
        return this.indices.length
      }, e.prototype.numIndices = function () {
        return this.indicesLength
      }, e.prototype.setIndicesLength = function (t) {
        this.dirtyIndices = !0, this.indicesLength = t
      }, e.prototype.getIndices = function () {
        return this.indices
      }, e.prototype.getVertexSizeInFloats = function () {
        for (var t = 0, e = 0; e < this.attributes.length; e++) {
          var r = this.attributes[e];
          t += r.numElements
        }
        return t
      }, e.prototype.setVertices = function (t) {
        if (this.dirtyVertices = !0, t.length > this.vertices.length) throw Error("Mesh can't store more than " + this.maxVertices() + " vertices");
        this.vertices.set(t, 0), this.verticesLength = t.length
      }, e.prototype.setIndices = function (t) {
        if (this.dirtyIndices = !0, t.length > this.indices.length) throw Error("Mesh can't store more than " + this.maxIndices() + " indices");
        this.indices.set(t, 0), this.indicesLength = t.length
      }, e.prototype.draw = function (t, e) {
        this.drawWithOffset(t, e, 0, this.indicesLength > 0 ? this.indicesLength : this.verticesLength / this.elementsPerVertex)
      }, e.prototype.drawWithOffset = function (t, e, r, n) {
        var i = this.context.gl;
        (this.dirtyVertices || this.dirtyIndices) && this.update(), this.bind(t), this.indicesLength > 0 ? i.drawElements(e, n, i.UNSIGNED_SHORT, 2 * r) : i.drawArrays(e, r, n), this.unbind(t)
      }, e.prototype.bind = function (t) {
        var e = this.context.gl;
        e.bindBuffer(e.ARRAY_BUFFER, this.verticesBuffer);
        for (var r = 0, n = 0; n < this.attributes.length; n++) {
          var i = this.attributes[n],
            a = t.getAttributeLocation(i.name);
          e.enableVertexAttribArray(a), e.vertexAttribPointer(a, i.numElements, e.FLOAT, !1, 4 * this.elementsPerVertex, 4 * r), r += i.numElements
        }
        this.indicesLength > 0 && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
      }, e.prototype.unbind = function (t) {
        for (var e = this.context.gl, r = 0; r < this.attributes.length; r++) {
          var n = this.attributes[r],
            i = t.getAttributeLocation(n.name);
          e.disableVertexAttribArray(i)
        }
        e.bindBuffer(e.ARRAY_BUFFER, null), this.indicesLength > 0 && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null)
      }, e.prototype.update = function () {
        var t = this.context.gl;
        this.dirtyVertices && (this.verticesBuffer || (this.verticesBuffer = t.createBuffer()), t.bindBuffer(t.ARRAY_BUFFER, this.verticesBuffer), t.bufferData(t.ARRAY_BUFFER, this.vertices.subarray(0, this.verticesLength), t.DYNAMIC_DRAW), this.dirtyVertices = !1), this.dirtyIndices && (this.indicesBuffer || (this.indicesBuffer = t.createBuffer()), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this.indicesBuffer), t.bufferData(t.ELEMENT_ARRAY_BUFFER, this.indices.subarray(0, this.indicesLength), t.DYNAMIC_DRAW), this.dirtyIndices = !1)
      }, e.prototype.restore = function () {
        this.verticesBuffer = null, this.indicesBuffer = null, this.update()
      }, e.prototype.dispose = function () {
        this.context.removeRestorable(this);
        var t = this.context.gl;
        t.deleteBuffer(this.verticesBuffer), t.deleteBuffer(this.indicesBuffer)
      }, e
    }();
    t.Mesh = e;
    var r = function () {
      function t(t, e, r) {
        this.name = t, this.type = e, this.numElements = r
      }
      return t
    }();
    t.VertexAttribute = r;
    var n = function (e) {
      function r() {
        return e.call(this, t.Shader.POSITION, h.Float, 2) || this
      }
      return __extends(r, e), r
    }(r);
    t.Position2Attribute = n;
    var i = function (e) {
      function r() {
        return e.call(this, t.Shader.POSITION, h.Float, 3) || this
      }
      return __extends(r, e), r
    }(r);
    t.Position3Attribute = i;
    var a = function (e) {
      function r(r) {
        return void 0 === r && (r = 0), e.call(this, t.Shader.TEXCOORDS + (0 == r ? "" : r), h.Float, 2) || this;
      }
      return __extends(r, e), r
    }(r);
    t.TexCoordAttribute = a;
    var o = function (e) {
      function r() {
        return e.call(this, t.Shader.COLOR, h.Float, 4) || this
      }
      return __extends(r, e), r
    }(r);
    t.ColorAttribute = o;
    var s = function (e) {
      function r() {
        return e.call(this, t.Shader.COLOR2, h.Float, 4) || this
      }
      return __extends(r, e), r
    }(r);
    t.Color2Attribute = s;
    var h;
    (function (t) {
      t[t.Float = 0] = "Float"
    })(h = t.VertexAttributeType || (t.VertexAttributeType = {}))
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (t) {
    var e = function () {
      function e(e, r, n) {
        if (void 0 === r && (r = !0), void 0 === n && (n = 10920), this.isDrawing = !1, this.shader = null, this.lastTexture = null, this.verticesLength = 0, this.indicesLength = 0, n > 10920) throw new Error("Can't have more than 10920 triangles per batch: " + n);
        this.context = e instanceof t.ManagedWebGLRenderingContext ? e : new t.ManagedWebGLRenderingContext(e);
        var i = r ? [new t.Position2Attribute, new t.ColorAttribute, new t.TexCoordAttribute, new t.Color2Attribute] : [new t.Position2Attribute, new t.ColorAttribute, new t.TexCoordAttribute];
        this.mesh = new t.Mesh(e, i, n, 3 * n), this.srcBlend = this.context.gl.SRC_ALPHA, this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA
      }
      return e.prototype.begin = function (t) {
        var e = this.context.gl;
        if (this.isDrawing) throw new Error("PolygonBatch is already drawing. Call PolygonBatch.end() before calling PolygonBatch.begin()");
        this.drawCalls = 0, this.shader = t, this.lastTexture = null, this.isDrawing = !0, e.enable(e.BLEND), e.blendFunc(this.srcBlend, this.dstBlend)
      }, e.prototype.setBlendMode = function (t, e) {
        var r = this.context.gl;
        this.srcBlend = t, this.dstBlend = e, this.isDrawing && (this.flush(), r.blendFunc(this.srcBlend, this.dstBlend))
      }, e.prototype.draw = function (t, e, r) {
        t != this.lastTexture ? (this.flush(), this.lastTexture = t) : (this.verticesLength + e.length > this.mesh.getVertices().length || this.indicesLength + r.length > this.mesh.getIndices().length) && this.flush();
        var n = this.mesh.numVertices();
        this.mesh.getVertices().set(e, this.verticesLength), this.verticesLength += e.length, this.mesh.setVerticesLength(this.verticesLength);
        for (var i = this.mesh.getIndices(), a = this.indicesLength, o = 0; o < r.length; a++, o++) i[a] = r[o] + n;
        this.indicesLength += r.length, this.mesh.setIndicesLength(this.indicesLength)
      }, e.prototype.flush = function () {
        var t = this.context.gl;
        0 != this.verticesLength && (this.lastTexture.bind(), this.mesh.draw(this.shader, t.TRIANGLES), this.verticesLength = 0, this.indicesLength = 0, this.mesh.setVerticesLength(0), this.mesh.setIndicesLength(0), this.drawCalls++)
      }, e.prototype.end = function () {
        var t = this.context.gl;
        if (!this.isDrawing) throw new Error("PolygonBatch is not drawing. Call PolygonBatch.begin() before calling PolygonBatch.end()");
        (this.verticesLength > 0 || this.indicesLength > 0) && this.flush(), this.shader = null, this.lastTexture = null, this.isDrawing = !1, t.disable(t.BLEND)
      }, e.prototype.getDrawCalls = function () {
        return this.drawCalls
      }, e.prototype.dispose = function () {
        this.mesh.dispose()
      }, e
    }();
    t.PolygonBatcher = e
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function () {
      function r(r, n, i) {
        void 0 === i && (i = !0), this.twoColorTint = !1, this.activeRenderer = null, this.QUAD = [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0], this.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0], this.WHITE = new t.Color(1, 1, 1, 1), this.canvas = r, this.context = n instanceof e.ManagedWebGLRenderingContext ? n : new e.ManagedWebGLRenderingContext(n), this.twoColorTint = i, this.camera = new e.OrthoCamera(r.width, r.height), this.batcherShader = i ? e.Shader.newTwoColoredTextured(this.context) : e.Shader.newColoredTextured(this.context), this.batcher = new e.PolygonBatcher(this.context, i), this.shapesShader = e.Shader.newColored(this.context), this.shapes = new e.ShapeRenderer(this.context), this.skeletonRenderer = new e.SkeletonRenderer(this.context, i), this.skeletonDebugRenderer = new e.SkeletonDebugRenderer(this.context)
      }
      return r.prototype.begin = function () {
        this.camera.update(), this.enableRenderer(this.batcher)
      }, r.prototype.drawSkeleton = function (t, e, r, n) {
        void 0 === e && (e = !1), void 0 === r && (r = -1), void 0 === n && (n = -1), this.enableRenderer(this.batcher), this.skeletonRenderer.premultipliedAlpha = e, this.skeletonRenderer.draw(this.batcher, t, r, n)
      }, r.prototype.drawSkeletonDebug = function (t, e, r) {
        void 0 === e && (e = !1), void 0 === r && (r = null), this.enableRenderer(this.shapes), this.skeletonDebugRenderer.premultipliedAlpha = e, this.skeletonDebugRenderer.draw(this.shapes, t, r)
      }, r.prototype.drawTexture = function (t, e, r, n, i, a) {
        void 0 === a && (a = null), this.enableRenderer(this.batcher), null === a && (a = this.WHITE);
        var o = this.QUAD,
          s = 0;
        o[s++] = e, o[s++] = r, o[s++] = a.r, o[s++] = a.g, o[s++] = a.b, o[s++] = a.a, o[s++] = 0, o[s++] = 1, this.twoColorTint && (o[s++] = 0, o[s++] = 0, o[s++] = 0, o[s++] = 0), o[s++] = e + n, o[s++] = r, o[s++] = a.r, o[s++] = a.g, o[s++] = a.b, o[s++] = a.a, o[s++] = 1, o[s++] = 1, this.twoColorTint && (o[s++] = 0, o[s++] = 0, o[s++] = 0, o[s++] = 0), o[s++] = e + n, o[s++] = r + i, o[s++] = a.r, o[s++] = a.g, o[s++] = a.b, o[s++] = a.a, o[s++] = 1, o[s++] = 0, this.twoColorTint && (o[s++] = 0, o[s++] = 0, o[s++] = 0, o[s++] = 0), o[s++] = e, o[s++] = r + i, o[s++] = a.r, o[s++] = a.g, o[s++] = a.b, o[s++] = a.a, o[s++] = 0, o[s++] = 0, this.twoColorTint && (o[s++] = 0, o[s++] = 0, o[s++] = 0, o[s++] = 0), this.batcher.draw(t, o, this.QUAD_TRIANGLES)
      }, r.prototype.drawTextureUV = function (t, e, r, n, i, a, o, s, h, l) {
        void 0 === l && (l = null), this.enableRenderer(this.batcher), null === l && (l = this.WHITE);
        var u = this.QUAD,
          c = 0;
        u[c++] = e, u[c++] = r, u[c++] = l.r, u[c++] = l.g, u[c++] = l.b, u[c++] = l.a, u[c++] = a, u[c++] = o, this.twoColorTint && (u[c++] = 0, u[c++] = 0, u[c++] = 0, u[c++] = 0), u[c++] = e + n, u[c++] = r, u[c++] = l.r, u[c++] = l.g, u[c++] = l.b, u[c++] = l.a, u[c++] = s, u[c++] = o, this.twoColorTint && (u[c++] = 0, u[c++] = 0, u[c++] = 0, u[c++] = 0), u[c++] = e + n, u[c++] = r + i, u[c++] = l.r, u[c++] = l.g, u[c++] = l.b, u[c++] = l.a, u[c++] = s, u[c++] = h, this.twoColorTint && (u[c++] = 0, u[c++] = 0, u[c++] = 0, u[c++] = 0), u[c++] = e, u[c++] = r + i, u[c++] = l.r, u[c++] = l.g, u[c++] = l.b, u[c++] = l.a, u[c++] = a, u[c++] = h, this.twoColorTint && (u[c++] = 0, u[c++] = 0, u[c++] = 0, u[c++] = 0), this.batcher.draw(t, u, this.QUAD_TRIANGLES)
      }, r.prototype.drawTextureRotated = function (e, r, n, i, a, o, s, h, l, u) {
        void 0 === l && (l = null), void 0 === u && (u = !1), this.enableRenderer(this.batcher), null === l && (l = this.WHITE);
        var c = this.QUAD,
          d = r + o,
          p = n + s,
          f = -o,
          v = -s,
          M = i - o,
          g = a - s,
          m = f,
          y = v,
          x = f,
          w = g,
          A = M,
          T = g,
          E = M,
          b = v,
          C = 0,
          R = 0,
          I = 0,
          S = 0,
          P = 0,
          V = 0,
          F = 0,
          L = 0;
        if (0 != h) {
          var _ = t.MathUtils.cosDeg(h),
            k = t.MathUtils.sinDeg(h);
          C = _ * m - k * y, R = k * m + _ * y, F = _ * x - k * w, L = k * x + _ * w, P = _ * A - k * T, V = k * A + _ * T, I = P + (C - F), S = V + (R - L)
        } else C = m, R = y, F = x, L = w, P = A, V = T, I = E, S = b;
        C += d, R += p, I += d, S += p, P += d, V += p, F += d, L += p;
        var N = 0;
        c[N++] = C, c[N++] = R, c[N++] = l.r, c[N++] = l.g, c[N++] = l.b, c[N++] = l.a, c[N++] = 0, c[N++] = 1, this.twoColorTint && (c[N++] = 0, c[N++] = 0, c[N++] = 0, c[N++] = 0), c[N++] = I, c[N++] = S, c[N++] = l.r, c[N++] = l.g, c[N++] = l.b, c[N++] = l.a, c[N++] = 1, c[N++] = 1, this.twoColorTint && (c[N++] = 0, c[N++] = 0, c[N++] = 0, c[N++] = 0), c[N++] = P, c[N++] = V, c[N++] = l.r, c[N++] = l.g, c[N++] = l.b, c[N++] = l.a, c[N++] = 1, c[N++] = 0, this.twoColorTint && (c[N++] = 0, c[N++] = 0, c[N++] = 0, c[N++] = 0), c[N++] = F, c[N++] = L, c[N++] = l.r, c[N++] = l.g, c[N++] = l.b, c[N++] = l.a, c[N++] = 0, c[N++] = 0, this.twoColorTint && (c[N++] = 0, c[N++] = 0, c[N++] = 0, c[N++] = 0), this.batcher.draw(e, c, this.QUAD_TRIANGLES)
      }, r.prototype.drawRegion = function (t, e, r, n, i, a, o) {
        void 0 === a && (a = null), void 0 === o && (o = !1), this.enableRenderer(this.batcher), null === a && (a = this.WHITE);
        var s = this.QUAD,
          h = 0;
        s[h++] = e, s[h++] = r, s[h++] = a.r, s[h++] = a.g, s[h++] = a.b, s[h++] = a.a, s[h++] = t.u, s[h++] = t.v2, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = e + n, s[h++] = r, s[h++] = a.r, s[h++] = a.g, s[h++] = a.b, s[h++] = a.a, s[h++] = t.u2, s[h++] = t.v2, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = e + n, s[h++] = r + i, s[h++] = a.r, s[h++] = a.g, s[h++] = a.b, s[h++] = a.a, s[h++] = t.u2, s[h++] = t.v, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), s[h++] = e, s[h++] = r + i, s[h++] = a.r, s[h++] = a.g, s[h++] = a.b, s[h++] = a.a, s[h++] = t.u, s[h++] = t.v, this.twoColorTint && (s[h++] = 0, s[h++] = 0, s[h++] = 0, s[h++] = 0), this.batcher.draw(t.texture, s, this.QUAD_TRIANGLES)
      }, r.prototype.line = function (t, e, r, n, i, a) {
        void 0 === i && (i = null), void 0 === a && (a = null), this.enableRenderer(this.shapes), this.shapes.line(t, e, r, n, i)
      }, r.prototype.triangle = function (t, e, r, n, i, a, o, s, h, l) {
        void 0 === s && (s = null), void 0 === h && (h = null), void 0 === l && (l = null), this.enableRenderer(this.shapes), this.shapes.triangle(t, e, r, n, i, a, o, s, h, l)
      }, r.prototype.quad = function (t, e, r, n, i, a, o, s, h, l, u, c, d) {
        void 0 === l && (l = null), void 0 === u && (u = null), void 0 === c && (c = null), void 0 === d && (d = null), this.enableRenderer(this.shapes), this.shapes.quad(t, e, r, n, i, a, o, s, h, l, u, c, d)
      }, r.prototype.rect = function (t, e, r, n, i, a) {
        void 0 === a && (a = null), this.enableRenderer(this.shapes), this.shapes.rect(t, e, r, n, i, a)
      }, r.prototype.rectLine = function (t, e, r, n, i, a, o) {
        void 0 === o && (o = null), this.enableRenderer(this.shapes), this.shapes.rectLine(t, e, r, n, i, a, o)
      }, r.prototype.polygon = function (t, e, r, n) {
        void 0 === n && (n = null), this.enableRenderer(this.shapes), this.shapes.polygon(t, e, r, n)
      }, r.prototype.circle = function (t, e, r, n, i, a) {
        void 0 === i && (i = null), void 0 === a && (a = 0), this.enableRenderer(this.shapes), this.shapes.circle(t, e, r, n, i, a)
      }, r.prototype.curve = function (t, e, r, n, i, a, o, s, h, l) {
        void 0 === l && (l = null), this.enableRenderer(this.shapes), this.shapes.curve(t, e, r, n, i, a, o, s, h, l)
      }, r.prototype.end = function () {
        this.activeRenderer === this.batcher ? this.batcher.end() : this.activeRenderer === this.shapes && this.shapes.end(), this.activeRenderer = null
      }, r.prototype.resize = function (t) {
        var e = this.canvas,
          r = e.clientWidth,
          i = e.clientHeight;
        if (e.width == r && e.height == i || (e.width = r, e.height = i), this.context.gl.viewport(0, 0, e.width, e.height), t === n.Stretch);
        else if (t === n.Expand) this.camera.setViewport(r, i);
        else if (t === n.Fit) {
          var a = e.width,
            o = e.height,
            s = this.camera.viewportWidth,
            h = this.camera.viewportHeight,
            l = h / s,
            u = o / a,
            c = l < u ? s / a : h / o;
          this.camera.viewportWidth = a * c, this.camera.viewportHeight = o * c
        }
        this.camera.update()
      }, r.prototype.enableRenderer = function (t) {
        this.activeRenderer !== t && (this.end(), t instanceof e.PolygonBatcher ? (this.batcherShader.bind(), this.batcherShader.setUniform4x4f(e.Shader.MVP_MATRIX, this.camera.projectionView.values), this.batcherShader.setUniformi("u_texture", 0), this.batcher.begin(this.batcherShader), this.activeRenderer = this.batcher) : t instanceof e.ShapeRenderer ? (this.shapesShader.bind(), this.shapesShader.setUniform4x4f(e.Shader.MVP_MATRIX, this.camera.projectionView.values), this.shapes.begin(this.shapesShader), this.activeRenderer = this.shapes) : this.activeRenderer = this.skeletonDebugRenderer)
      }, r.prototype.dispose = function () {
        this.batcher.dispose(), this.batcherShader.dispose(), this.shapes.dispose(), this.shapesShader.dispose(), this.skeletonDebugRenderer.dispose()
      }, r
    }();
    e.SceneRenderer = r;
    var n;
    (function (t) {
      t[t.Stretch = 0] = "Stretch", t[t.Expand = 1] = "Expand", t[t.Fit = 2] = "Fit"
    })(n = e.ResizeMode || (e.ResizeMode = {}))
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (t) {
    var e = function () {
      function e(e, r, n) {
        this.vertexShader = r, this.fragmentShader = n, this.vs = null, this.fs = null, this.program = null, this.tmp2x2 = new Float32Array(4), this.tmp3x3 = new Float32Array(9), this.tmp4x4 = new Float32Array(16), this.vsSource = r, this.fsSource = n, this.context = e instanceof t.ManagedWebGLRenderingContext ? e : new t.ManagedWebGLRenderingContext(e), this.context.addRestorable(this), this.compile()
      }
      return e.prototype.getProgram = function () {
        return this.program
      }, e.prototype.getVertexShader = function () {
        return this.vertexShader
      }, e.prototype.getFragmentShader = function () {
        return this.fragmentShader
      }, e.prototype.getVertexShaderSource = function () {
        return this.vsSource
      }, e.prototype.getFragmentSource = function () {
        return this.fsSource
      }, e.prototype.compile = function () {
        var t = this.context.gl;
        try {
          this.vs = this.compileShader(t.VERTEX_SHADER, this.vertexShader), this.fs = this.compileShader(t.FRAGMENT_SHADER, this.fragmentShader), this.program = this.compileProgram(this.vs, this.fs)
        } catch (t) {
          throw this.dispose(), t
        }
      }, e.prototype.compileShader = function (t, e) {
        var r = this.context.gl,
          n = r.createShader(t);
        if (r.shaderSource(n, e), r.compileShader(n), !r.getShaderParameter(n, r.COMPILE_STATUS)) {
          var i = "Couldn't compile shader: " + r.getShaderInfoLog(n);
          if (r.deleteShader(n), !r.isContextLost()) throw new Error(i)
        }
        return n
      }, e.prototype.compileProgram = function (t, e) {
        var r = this.context.gl,
          n = r.createProgram();
        if (r.attachShader(n, t), r.attachShader(n, e), r.linkProgram(n), !r.getProgramParameter(n, r.LINK_STATUS)) {
          var i = "Couldn't compile shader program: " + r.getProgramInfoLog(n);
          if (r.deleteProgram(n), !r.isContextLost()) throw new Error(i)
        }
        return n
      }, e.prototype.restore = function () {
        this.compile()
      }, e.prototype.bind = function () {
        this.context.gl.useProgram(this.program)
      }, e.prototype.unbind = function () {
        this.context.gl.useProgram(null)
      }, e.prototype.setUniformi = function (t, e) {
        this.context.gl.uniform1i(this.getUniformLocation(t), e)
      }, e.prototype.setUniformf = function (t, e) {
        this.context.gl.uniform1f(this.getUniformLocation(t), e)
      }, e.prototype.setUniform2f = function (t, e, r) {
        this.context.gl.uniform2f(this.getUniformLocation(t), e, r)
      }, e.prototype.setUniform3f = function (t, e, r, n) {
        this.context.gl.uniform3f(this.getUniformLocation(t), e, r, n)
      }, e.prototype.setUniform4f = function (t, e, r, n, i) {
        this.context.gl.uniform4f(this.getUniformLocation(t), e, r, n, i)
      }, e.prototype.setUniform2x2f = function (t, e) {
        var r = this.context.gl;
        this.tmp2x2.set(e), r.uniformMatrix2fv(this.getUniformLocation(t), !1, this.tmp2x2)
      }, e.prototype.setUniform3x3f = function (t, e) {
        var r = this.context.gl;
        this.tmp3x3.set(e), r.uniformMatrix3fv(this.getUniformLocation(t), !1, this.tmp3x3)
      }, e.prototype.setUniform4x4f = function (t, e) {
        var r = this.context.gl;
        this.tmp4x4.set(e), r.uniformMatrix4fv(this.getUniformLocation(t), !1, this.tmp4x4)
      }, e.prototype.getUniformLocation = function (t) {
        var e = this.context.gl,
          r = e.getUniformLocation(this.program, t);
        if (!r && !e.isContextLost()) throw new Error("Couldn't find location for uniform " + t);
        return r
      }, e.prototype.getAttributeLocation = function (t) {
        var e = this.context.gl,
          r = e.getAttribLocation(this.program, t);
        if (r == -1 && !e.isContextLost()) throw new Error("Couldn't find location for attribute " + t);
        return r
      }, e.prototype.dispose = function () {
        this.context.removeRestorable(this);
        var t = this.context.gl;
        this.vs && (t.deleteShader(this.vs), this.vs = null), this.fs && (t.deleteShader(this.fs), this.fs = null), this.program && (t.deleteProgram(this.program), this.program = null)
      }, e.newColoredTextured = function (t) {
        var r = "\n\t\t\t\tattribute vec4 " + e.POSITION + ";\n\t\t\t\tattribute vec4 " + e.COLOR + ";\n\t\t\t\tattribute vec2 " + e.TEXCOORDS + ";\n\t\t\t\tuniform mat4 " + e.MVP_MATRIX + ";\n\t\t\t\tvarying vec4 v_color;\n\t\t\t\tvarying vec2 v_texCoords;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tv_color = " + e.COLOR + ";\n\t\t\t\t\tv_texCoords = " + e.TEXCOORDS + ";\n\t\t\t\t\tgl_Position = " + e.MVP_MATRIX + " * " + e.POSITION + ";\n\t\t\t\t}\n\t\t\t",
          n = "\n\t\t\t\t#ifdef GL_ES\n\t\t\t\t\t#define LOWP lowp\n\t\t\t\t\tprecision mediump float;\n\t\t\t\t#else\n\t\t\t\t\t#define LOWP\n\t\t\t\t#endif\n\t\t\t\tvarying LOWP vec4 v_color;\n\t\t\t\tvarying vec2 v_texCoords;\n\t\t\t\tuniform sampler2D u_texture;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tgl_FragColor = v_color * texture2D(u_texture, v_texCoords);\n\t\t\t\t}\n\t\t\t";
        return new e(t, r, n)
      }, e.newTwoColoredTextured = function (t) {
        var r = "\n\t\t\t\tattribute vec4 " + e.POSITION + ";\n\t\t\t\tattribute vec4 " + e.COLOR + ";\n\t\t\t\tattribute vec4 " + e.COLOR2 + ";\n\t\t\t\tattribute vec2 " + e.TEXCOORDS + ";\n\t\t\t\tuniform mat4 " + e.MVP_MATRIX + ";\n\t\t\t\tvarying vec4 v_light;\n\t\t\t\tvarying vec4 v_dark;\n\t\t\t\tvarying vec2 v_texCoords;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tv_light = " + e.COLOR + ";\n\t\t\t\t\tv_dark = " + e.COLOR2 + ";\n\t\t\t\t\tv_texCoords = " + e.TEXCOORDS + ";\n\t\t\t\t\tgl_Position = " + e.MVP_MATRIX + " * " + e.POSITION + ";\n\t\t\t\t}\n\t\t\t",
          n = "\n\t\t\t\t#ifdef GL_ES\n\t\t\t\t\t#define LOWP lowp\n\t\t\t\t\tprecision mediump float;\n\t\t\t\t#else\n\t\t\t\t\t#define LOWP\n\t\t\t\t#endif\n\t\t\t\tvarying LOWP vec4 v_light;\n\t\t\t\tvarying LOWP vec4 v_dark;\n\t\t\t\tvarying vec2 v_texCoords;\n\t\t\t\tuniform sampler2D u_texture;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tvec4 texColor = texture2D(u_texture, v_texCoords);\n\t\t\t\t\tgl_FragColor.a = texColor.a * v_light.a;\n\t\t\t\t\tgl_FragColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;\n\t\t\t\t}\n\t\t\t";
        return new e(t, r, n)
      }, e.newColored = function (t) {
        var r = "\n\t\t\t\tattribute vec4 " + e.POSITION + ";\n\t\t\t\tattribute vec4 " + e.COLOR + ";\n\t\t\t\tuniform mat4 " + e.MVP_MATRIX + ";\n\t\t\t\tvarying vec4 v_color;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tv_color = " + e.COLOR + ";\n\t\t\t\t\tgl_Position = " + e.MVP_MATRIX + " * " + e.POSITION + ";\n\t\t\t\t}\n\t\t\t",
          n = "\n\t\t\t\t#ifdef GL_ES\n\t\t\t\t\t#define LOWP lowp\n\t\t\t\t\tprecision mediump float;\n\t\t\t\t#else\n\t\t\t\t\t#define LOWP\n\t\t\t\t#endif\n\t\t\t\tvarying LOWP vec4 v_color;\n\n\t\t\t\tvoid main () {\n\t\t\t\t\tgl_FragColor = v_color;\n\t\t\t\t}\n\t\t\t";
        return new e(t, r, n)
      }, e.MVP_MATRIX = "u_projTrans", e.POSITION = "a_position", e.COLOR = "a_color", e.COLOR2 = "a_color2", e.TEXCOORDS = "a_texCoords", e.SAMPLER = "u_texture", e
    }();
    t.Shader = e
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function () {
      function r(r, i) {
        if (void 0 === i && (i = 10920), this.isDrawing = !1, this.shapeType = n.Filled, this.color = new t.Color(1, 1, 1, 1), this.vertexIndex = 0, this.tmp = new t.Vector2, i > 10920) throw new Error("Can't have more than 10920 triangles per batch: " + i);
        this.context = r instanceof e.ManagedWebGLRenderingContext ? r : new e.ManagedWebGLRenderingContext(r), this.mesh = new e.Mesh(r, [new e.Position2Attribute, new e.ColorAttribute], i, 0), this.srcBlend = this.context.gl.SRC_ALPHA, this.dstBlend = this.context.gl.ONE_MINUS_SRC_ALPHA
      }
      return r.prototype.begin = function (t) {
        if (this.isDrawing) throw new Error("ShapeRenderer.begin() has already been called");
        this.shader = t, this.vertexIndex = 0, this.isDrawing = !0;
        var e = this.context.gl;
        e.enable(e.BLEND), e.blendFunc(this.srcBlend, this.dstBlend)
      }, r.prototype.setBlendMode = function (t, e) {
        var r = this.context.gl;
        this.srcBlend = t, this.dstBlend = e, this.isDrawing && (this.flush(), r.blendFunc(this.srcBlend, this.dstBlend))
      }, r.prototype.setColor = function (t) {
        this.color.setFromColor(t)
      }, r.prototype.setColorWith = function (t, e, r, n) {
        this.color.set(t, e, r, n)
      }, r.prototype.point = function (t, e, r) {
        void 0 === r && (r = null), this.check(n.Point, 1), null === r && (r = this.color), this.vertex(t, e, r)
      }, r.prototype.line = function (t, e, r, i, a) {
        void 0 === a && (a = null), this.check(n.Line, 2);
        this.mesh.getVertices(), this.vertexIndex;
        null === a && (a = this.color), this.vertex(t, e, a), this.vertex(r, i, a)
      }, r.prototype.triangle = function (t, e, r, i, a, o, s, h, l, u) {
        void 0 === h && (h = null), void 0 === l && (l = null), void 0 === u && (u = null), this.check(t ? n.Filled : n.Line, 3);
        this.mesh.getVertices(), this.vertexIndex;
        null === h && (h = this.color), null === l && (l = this.color), null === u && (u = this.color), t ? (this.vertex(e, r, h), this.vertex(i, a, l), this.vertex(o, s, u)) : (this.vertex(e, r, h), this.vertex(i, a, l), this.vertex(i, a, h), this.vertex(o, s, l), this.vertex(o, s, h), this.vertex(e, r, l))
      }, r.prototype.quad = function (t, e, r, i, a, o, s, h, l, u, c, d, p) {
        void 0 === u && (u = null), void 0 === c && (c = null), void 0 === d && (d = null), void 0 === p && (p = null), this.check(t ? n.Filled : n.Line, 3);
        this.mesh.getVertices(), this.vertexIndex;
        null === u && (u = this.color), null === c && (c = this.color), null === d && (d = this.color), null === p && (p = this.color), t ? (this.vertex(e, r, u), this.vertex(i, a, c), this.vertex(o, s, d), this.vertex(o, s, d), this.vertex(h, l, p), this.vertex(e, r, u)) : (this.vertex(e, r, u), this.vertex(i, a, c), this.vertex(i, a, c), this.vertex(o, s, d), this.vertex(o, s, d), this.vertex(h, l, p), this.vertex(h, l, p), this.vertex(e, r, u))
      }, r.prototype.rect = function (t, e, r, n, i, a) {
        void 0 === a && (a = null), this.quad(t, e, r, e + n, r, e + n, r + i, e, r + i, a, a, a, a)
      }, r.prototype.rectLine = function (t, e, r, i, a, o, s) {
        void 0 === s && (s = null), this.check(t ? n.Filled : n.Line, 8), null === s && (s = this.color);
        var h = this.tmp.set(a - r, e - i);
        h.normalize(), o *= .5;
        var l = h.x * o,
          u = h.y * o;
        t ? (this.vertex(e + l, r + u, s), this.vertex(e - l, r - u, s), this.vertex(i + l, a + u, s), this.vertex(i - l, a - u, s), this.vertex(i + l, a + u, s), this.vertex(e - l, r - u, s)) : (this.vertex(e + l, r + u, s), this.vertex(e - l, r - u, s), this.vertex(i + l, a + u, s), this.vertex(i - l, a - u, s), this.vertex(i + l, a + u, s), this.vertex(e + l, r + u, s), this.vertex(i - l, a - u, s), this.vertex(e - l, r - u, s))
      }, r.prototype.x = function (t, e, r) {
        this.line(t - r, e - r, t + r, e + r), this.line(t - r, e + r, t + r, e - r)
      }, r.prototype.polygon = function (t, e, r, i) {
        if (void 0 === i && (i = null), r < 3) throw new Error("Polygon must contain at least 3 vertices");
        this.check(n.Line, 2 * r), null === i && (i = this.color);
        this.mesh.getVertices(), this.vertexIndex;
        e <<= 1, r <<= 1;
        for (var a = t[e], o = t[e + 1], s = e + r, h = e, l = e + r - 2; h < l; h += 2) {
          var u = t[h],
            c = t[h + 1],
            d = 0,
            p = 0;
          h + 2 >= s ? (d = a, p = o) : (d = t[h + 2], p = t[h + 3]), this.vertex(u, c, i), this.vertex(d, p, i)
        }
      }, r.prototype.circle = function (e, r, i, a, o, s) {
        if (void 0 === o && (o = null), void 0 === s && (s = 0), 0 === s && (s = Math.max(1, 6 * t.MathUtils.cbrt(a) | 0)), s <= 0) throw new Error("segments must be > 0.");
        null === o && (o = this.color);
        var h = 2 * t.MathUtils.PI / s,
          l = Math.cos(h),
          u = Math.sin(h),
          c = a,
          d = 0;
        if (e) {
          this.check(n.Filled, 3 * s + 3), s--;
          for (var p = 0; p < s; p++) {
            this.vertex(r, i, o), this.vertex(r + c, i + d, o);
            var f = c;
            c = l * c - u * d, d = u * f + l * d, this.vertex(r + c, i + d, o)
          }
          this.vertex(r, i, o), this.vertex(r + c, i + d, o)
        } else {
          this.check(n.Line, 2 * s + 2);
          for (var p = 0; p < s; p++) {
            this.vertex(r + c, i + d, o);
            var v = c;
            c = l * c - u * d, d = u * v + l * d, this.vertex(r + c, i + d, o)
          }
          this.vertex(r + c, i + d, o)
        }
        c = a, d = 0, this.vertex(r + c, i + d, o)
      }, r.prototype.curve = function (t, e, r, i, a, o, s, h, l, u) {
        void 0 === u && (u = null), this.check(n.Line, 2 * l + 2), null === u && (u = this.color);
        for (var c = 1 / l, d = c * c, p = c * c * c, f = 3 * c, v = 3 * d, M = 6 * d, g = 6 * p, m = t - 2 * r + a, y = e - 2 * i + o, x = 3 * (r - a) - t + s, w = 3 * (i - o) - e + h, A = t, T = e, E = (r - t) * f + m * v + x * p, b = (i - e) * f + y * v + w * p, C = m * M + x * g, R = y * M + w * g, I = x * g, S = w * g; l-- > 0;) this.vertex(A, T, u), A += E, T += b, E += C, b += R, C += I, R += S, this.vertex(A, T, u);
        this.vertex(A, T, u), this.vertex(s, h, u)
      }, r.prototype.vertex = function (t, e, r) {
        var n = this.vertexIndex,
          i = this.mesh.getVertices();
        i[n++] = t, i[n++] = e, i[n++] = r.r, i[n++] = r.g, i[n++] = r.b, i[n++] = r.a, this.vertexIndex = n
      }, r.prototype.end = function () {
        if (!this.isDrawing) throw new Error("ShapeRenderer.begin() has not been called");
        this.flush(), this.context.gl.disable(this.context.gl.BLEND), this.isDrawing = !1
      }, r.prototype.flush = function () {
        0 != this.vertexIndex && (this.mesh.setVerticesLength(this.vertexIndex), this.mesh.draw(this.shader, this.shapeType), this.vertexIndex = 0)
      }, r.prototype.check = function (t, e) {
        if (!this.isDrawing) throw new Error("ShapeRenderer.begin() has not been called");
        if (this.shapeType == t) {
          if (!(this.mesh.maxVertices() - this.mesh.numVertices() < e)) return;
          this.flush()
        } else this.flush(), this.shapeType = t
      }, r.prototype.dispose = function () {
        this.mesh.dispose()
      }, r
    }();
    e.ShapeRenderer = r;
    var n;
    (function (t) {
      t[t.Point = 0] = "Point", t[t.Line = 1] = "Line", t[t.Filled = 4] = "Filled"
    })(n = e.ShapeType || (e.ShapeType = {}))
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function () {
      function r(r) {
        this.boneLineColor = new t.Color(1, 0, 0, 1), this.boneOriginColor = new t.Color(0, 1, 0, 1), this.attachmentLineColor = new t.Color(0, 0, 1, .5), this.triangleLineColor = new t.Color(1, .64, 0, .5), this.pathColor = (new t.Color).setFromString("FF7F00"), this.clipColor = new t.Color(.8, 0, 0, 2), this.aabbColor = new t.Color(0, 1, 0, .5), this.drawBones = !0, this.drawRegionAttachments = !0, this.drawBoundingBoxes = !0, this.drawMeshHull = !0, this.drawMeshTriangles = !0, this.drawPaths = !0, this.drawSkeletonXY = !1, this.drawClipping = !0, this.premultipliedAlpha = !1, this.scale = 1, this.boneWidth = 2, this.bounds = new t.SkeletonBounds, this.temp = new Array, this.vertices = t.Utils.newFloatArray(2048), this.context = r instanceof e.ManagedWebGLRenderingContext ? r : new e.ManagedWebGLRenderingContext(r)
      }
      return r.prototype.draw = function (e, n, i) {
        void 0 === i && (i = null);
        var a = n.x,
          o = n.y,
          s = this.context.gl,
          h = this.premultipliedAlpha ? s.ONE : s.SRC_ALPHA;
        e.setBlendMode(h, s.ONE_MINUS_SRC_ALPHA);
        var l = n.bones;
        if (this.drawBones) {
          e.setColor(this.boneLineColor);
          for (var u = 0, c = l.length; u < c; u++) {
            var d = l[u];
            if (!(i && i.indexOf(d.data.name) > -1) && null != d.parent) {
              var p = a + d.data.length * d.a + d.worldX,
                f = o + d.data.length * d.c + d.worldY;
              e.rectLine(!0, a + d.worldX, o + d.worldY, p, f, this.boneWidth * this.scale)
            }
          }
          this.drawSkeletonXY && e.x(a, o, 4 * this.scale)
        }
        if (this.drawRegionAttachments) {
          e.setColor(this.attachmentLineColor);
          for (var v = n.slots, u = 0, c = v.length; u < c; u++) {
            var M = v[u],
              g = M.getAttachment();
            if (g instanceof t.RegionAttachment) {
              var m = g,
                y = this.vertices;
              m.computeWorldVertices(M.bone, y, 0, 2), e.line(y[0], y[1], y[2], y[3]), e.line(y[2], y[3], y[4], y[5]), e.line(y[4], y[5], y[6], y[7]), e.line(y[6], y[7], y[0], y[1])
            }
          }
        }
        if (this.drawMeshHull || this.drawMeshTriangles)
          for (var v = n.slots, u = 0, c = v.length; u < c; u++) {
            var M = v[u],
              g = M.getAttachment();
            if (g instanceof t.MeshAttachment) {
              var x = g,
                y = this.vertices;
              x.computeWorldVertices(M, 0, x.worldVerticesLength, y, 0, 2);
              var w = x.triangles,
                A = x.hullLength;
              if (this.drawMeshTriangles) {
                e.setColor(this.triangleLineColor);
                for (var T = 0, E = w.length; T < E; T += 3) {
                  var b = 2 * w[T],
                    C = 2 * w[T + 1],
                    R = 2 * w[T + 2];
                  e.triangle(!1, y[b], y[b + 1], y[C], y[C + 1], y[R], y[R + 1])
                }
              }
              if (this.drawMeshHull && A > 0) {
                e.setColor(this.attachmentLineColor), A = 2 * (A >> 1);
                for (var I = y[A - 2], S = y[A - 1], T = 0, E = A; T < E; T += 2) {
                  var p = y[T],
                    f = y[T + 1];
                  e.line(p, f, I, S), I = p, S = f
                }
              }
            }
          }
        if (this.drawBoundingBoxes) {
          var P = this.bounds;
          P.update(n, !0), e.setColor(this.aabbColor), e.rect(!1, P.minX, P.minY, P.getWidth(), P.getHeight());
          for (var V = P.polygons, F = P.boundingBoxes, u = 0, c = V.length; u < c; u++) {
            var L = V[u];
            e.setColor(F[u].color), e.polygon(L, 0, L.length)
          }
        }
        if (this.drawPaths)
          for (var v = n.slots, u = 0, c = v.length; u < c; u++) {
            var M = v[u],
              g = M.getAttachment();
            if (g instanceof t.PathAttachment) {
              var _ = g,
                E = _.worldVerticesLength,
                k = this.temp = t.Utils.setArraySize(this.temp, E, 0);
              _.computeWorldVertices(M, 0, E, k, 0, 2);
              var N = this.pathColor,
                D = k[2],
                B = k[3],
                U = 0,
                O = 0;
              if (_.closed) {
                e.setColor(N);
                var X = k[0],
                  Y = k[1],
                  W = k[E - 2],
                  G = k[E - 1];
                U = k[E - 4], O = k[E - 3], e.curve(D, B, X, Y, W, G, U, O, 32), e.setColor(r.LIGHT_GRAY), e.line(D, B, X, Y), e.line(U, O, W, G)
              }
              E -= 4;
              for (var T = 4; T < E; T += 6) {
                var X = k[T],
                  Y = k[T + 1],
                  W = k[T + 2],
                  G = k[T + 3];
                U = k[T + 4], O = k[T + 5], e.setColor(N), e.curve(D, B, X, Y, W, G, U, O, 32), e.setColor(r.LIGHT_GRAY), e.line(D, B, X, Y), e.line(U, O, W, G), D = U, B = O
              }
            }
          }
        if (this.drawBones) {
          e.setColor(this.boneOriginColor);
          for (var u = 0, c = l.length; u < c; u++) {
            var d = l[u];
            i && i.indexOf(d.data.name) > -1 || e.circle(!0, a + d.worldX, o + d.worldY, 3 * this.scale, r.GREEN, 8)
          }
        }
        if (this.drawClipping) {
          var v = n.slots;
          e.setColor(this.clipColor);
          for (var u = 0, c = v.length; u < c; u++) {
            var M = v[u],
              g = M.getAttachment();
            if (g instanceof t.ClippingAttachment) {
              var q = g,
                E = q.worldVerticesLength,
                k = this.temp = t.Utils.setArraySize(this.temp, E, 0);
              q.computeWorldVertices(M, 0, E, k, 0, 2);
              for (var z = 0, j = k.length; z < j; z += 2) {
                var p = k[z],
                  f = k[z + 1],
                  U = k[(z + 2) % k.length],
                  O = k[(z + 3) % k.length];
                e.line(p, f, U, O)
              }
            }
          }
        }
      }, r.prototype.dispose = function () {}, r.LIGHT_GRAY = new t.Color(192 / 255, 192 / 255, 192 / 255, 1), r.GREEN = new t.Color(0, 1, 0, 1), r
    }();
    e.SkeletonDebugRenderer = r
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function () {
        function t(t, e, r) {
          this.vertices = t, this.numVertices = e, this.numFloats = r
        }
        return t
      }(),
      n = function () {
        function n(e, n) {
          void 0 === n && (n = !0), this.premultipliedAlpha = !1, this.vertexEffect = null, this.tempColor = new t.Color, this.tempColor2 = new t.Color, this.vertexSize = 8, this.twoColorTint = !1, this.renderable = new r(null, 0, 0), this.clipper = new t.SkeletonClipping, this.temp = new t.Vector2, this.temp2 = new t.Vector2, this.temp3 = new t.Color, this.temp4 = new t.Color, this.twoColorTint = n, n && (this.vertexSize += 4), this.vertices = t.Utils.newFloatArray(1024 * this.vertexSize)
        }
        return n.prototype.draw = function (r, i, a, o) {
          void 0 === a && (a = -1), void 0 === o && (o = -1);
          var s = this.clipper,
            h = this.premultipliedAlpha,
            l = this.twoColorTint,
            u = null,
            c = this.temp,
            d = this.temp2,
            p = this.temp3,
            f = this.temp4,
            v = this.renderable,
            M = null,
            g = null,
            m = i.drawOrder,
            y = null,
            x = i.color,
            w = l ? 12 : 8,
            A = !1;
          a == -1 && (A = !0);
          for (var T = 0, E = m.length; T < E; T++) {
            var b = s.isClipping() ? 2 : w,
              C = m[T];
            if (a >= 0 && a == C.data.index && (A = !0), A) {
              o >= 0 && o == C.data.index && (A = !1);
              var R = C.getAttachment(),
                I = null;
              if (R instanceof t.RegionAttachment) {
                var S = R;
                v.vertices = this.vertices, v.numVertices = 4, v.numFloats = b << 2, S.computeWorldVertices(C.bone, v.vertices, 0, b), g = n.QUAD_TRIANGLES, M = S.uvs, I = S.region.renderObject.texture, y = S.color
              } else {
                if (!(R instanceof t.MeshAttachment)) {
                  if (R instanceof t.ClippingAttachment) {
                    var P = R;
                    s.clipStart(C, P);
                    continue
                  }
                  continue
                }
                var V = R;
                v.vertices = this.vertices, v.numVertices = V.worldVerticesLength >> 1, v.numFloats = v.numVertices * b, v.numFloats > v.vertices.length && (v.vertices = this.vertices = t.Utils.newFloatArray(v.numFloats)), V.computeWorldVertices(C, 0, V.worldVerticesLength, v.vertices, 0, b), g = V.triangles, I = V.region.renderObject.texture, M = V.uvs, y = V.color
              }
              if (null != I) {
                var F = C.color,
                  L = this.tempColor;
                L.r = x.r * F.r * y.r, L.g = x.g * F.g * y.g, L.b = x.b * F.b * y.b, L.a = x.a * F.a * y.a, h && (L.r *= L.a, L.g *= L.a, L.b *= L.a);
                var _ = this.tempColor2;
                null == C.darkColor ? _.set(0, 0, 0, 1) : (h ? (_.r = C.darkColor.r * L.a, _.g = C.darkColor.g * L.a, _.b = C.darkColor.b * L.a) : _.setFromColor(C.darkColor), _.a = h ? 1 : 0);
                var k = C.data.blendMode;
                if (k != u && (u = k, r.setBlendMode(e.WebGLBlendModeConverter.getSourceGLBlendMode(u, h), e.WebGLBlendModeConverter.getDestGLBlendMode(u))), s.isClipping()) {
                  s.clipTriangles(v.vertices, v.numFloats, g, g.length, M, L, _, l);
                  var N = new Float32Array(s.clippedVertices),
                    D = s.clippedTriangles;
                  if (null != this.vertexEffect) {
                    var B = this.vertexEffect,
                      U = N;
                    if (l)
                      for (var O = 0, X = N.length; O < X; O += w) c.x = U[O], c.y = U[O + 1], p.set(U[O + 2], U[O + 3], U[O + 4], U[O + 5]), d.x = U[O + 6], d.y = U[O + 7], f.set(U[O + 8], U[O + 9], U[O + 10], U[O + 11]), B.transform(c, d, p, f), U[O] = c.x, U[O + 1] = c.y, U[O + 2] = p.r, U[O + 3] = p.g, U[O + 4] = p.b, U[O + 5] = p.a, U[O + 6] = d.x, U[O + 7] = d.y, U[O + 8] = f.r, U[O + 9] = f.g, U[O + 10] = f.b, U[O + 11] = f.a;
                    else
                      for (var O = 0, Y = N.length; O < Y; O += w) c.x = U[O], c.y = U[O + 1], p.set(U[O + 2], U[O + 3], U[O + 4], U[O + 5]), d.x = U[O + 6], d.y = U[O + 7], f.set(0, 0, 0, 0), B.transform(c, d, p, f), U[O] = c.x, U[O + 1] = c.y, U[O + 2] = p.r, U[O + 3] = p.g, U[O + 4] = p.b, U[O + 5] = p.a, U[O + 6] = d.x, U[O + 7] = d.y
                  }
                  r.draw(I, N, D)
                } else {
                  var U = v.vertices;
                  if (null != this.vertexEffect) {
                    var B = this.vertexEffect;
                    if (l)
                      for (var O = 0, W = 0, G = v.numFloats; O < G; O += w, W += 2) c.x = U[O], c.y = U[O + 1], d.x = M[W], d.y = M[W + 1], p.setFromColor(L), f.setFromColor(_), B.transform(c, d, p, f), U[O] = c.x, U[O + 1] = c.y, U[O + 2] = p.r, U[O + 3] = p.g, U[O + 4] = p.b, U[O + 5] = p.a, U[O + 6] = d.x, U[O + 7] = d.y, U[O + 8] = f.r, U[O + 9] = f.g, U[O + 10] = f.b, U[O + 11] = f.a;
                    else
                      for (var O = 0, W = 0, q = v.numFloats; O < q; O += w, W += 2) c.x = U[O], c.y = U[O + 1], d.x = M[W], d.y = M[W + 1], p.setFromColor(L), f.set(0, 0, 0, 0), B.transform(c, d, p, f), U[O] = c.x, U[O + 1] = c.y, U[O + 2] = p.r, U[O + 3] = p.g, U[O + 4] = p.b, U[O + 5] = p.a, U[O + 6] = d.x, U[O + 7] = d.y
                  } else if (l)
                    for (var O = 2, W = 0, z = v.numFloats; O < z; O += w, W += 2) U[O] = L.r, U[O + 1] = L.g, U[O + 2] = L.b, U[O + 3] = L.a, U[O + 4] = M[W], U[O + 5] = M[W + 1], U[O + 6] = _.r, U[O + 7] = _.g, U[O + 8] = _.b, U[O + 9] = _.a;
                  else
                    for (var O = 2, W = 0, j = v.numFloats; O < j; O += w, W += 2) U[O] = L.r, U[O + 1] = L.g, U[O + 2] = L.b, U[O + 3] = L.a, U[O + 4] = M[W], U[O + 5] = M[W + 1];
                  var H = v.vertices.subarray(0, v.numFloats);
                  r.draw(I, H, g)
                }
              }
              s.clipEndWithSlot(C)
            } else s.clipEndWithSlot(C)
          }
          s.clipEnd()
        }, n.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0], n
      }();
    e.SkeletonRenderer = n
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (t) {
    var e = function () {
      function e(t, e, r) {
        void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === r && (r = 0), this.x = 0, this.y = 0, this.z = 0, this.x = t, this.y = e, this.z = r
      }
      return e.prototype.setFrom = function (t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this
      }, e.prototype.set = function (t, e, r) {
        return this.x = t, this.y = e, this.z = r, this
      }, e.prototype.add = function (t) {
        return this.x += t.x, this.y += t.y, this.z += t.z, this
      }, e.prototype.sub = function (t) {
        return this.x -= t.x, this.y -= t.y, this.z -= t.z, this
      }, e.prototype.scale = function (t) {
        return this.x *= t, this.y *= t, this.z *= t, this
      }, e.prototype.normalize = function () {
        var t = this.length();
        return 0 == t ? this : (t = 1 / t, this.x *= t, this.y *= t, this.z *= t, this)
      }, e.prototype.cross = function (t) {
        return this.set(this.y * t.z - this.z * t.y, this.z * t.x - this.x * t.z, this.x * t.y - this.y * t.x)
      }, e.prototype.multiply = function (e) {
        var r = e.values;
        return this.set(this.x * r[t.M00] + this.y * r[t.M01] + this.z * r[t.M02] + r[t.M03], this.x * r[t.M10] + this.y * r[t.M11] + this.z * r[t.M12] + r[t.M13], this.x * r[t.M20] + this.y * r[t.M21] + this.z * r[t.M22] + r[t.M23])
      }, e.prototype.project = function (e) {
        var r = e.values,
          n = 1 / (this.x * r[t.M30] + this.y * r[t.M31] + this.z * r[t.M32] + r[t.M33]);
        return this.set((this.x * r[t.M00] + this.y * r[t.M01] + this.z * r[t.M02] + r[t.M03]) * n, (this.x * r[t.M10] + this.y * r[t.M11] + this.z * r[t.M12] + r[t.M13]) * n, (this.x * r[t.M20] + this.y * r[t.M21] + this.z * r[t.M22] + r[t.M23]) * n)
      }, e.prototype.dot = function (t) {
        return this.x * t.x + this.y * t.y + this.z * t.z
      }, e.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
      }, e.prototype.distance = function (t) {
        var e = t.x - this.x,
          r = t.y - this.y,
          n = t.z - this.z;
        return Math.sqrt(e * e + r * r + n * n)
      }, e
    }();
    t.Vector3 = e
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
var spine;
(function (t) {
  var e;
  (function (e) {
    var r = function () {
      function t(t, e) {
        void 0 === e && (e = {
          alpha: "true"
        });
        var r = this;
        if (this.restorables = new Array, t instanceof HTMLCanvasElement) {
          var n = t;
          this.gl = n.getContext("webgl", e) || n.getContext("experimental-webgl", e), this.canvas = n, n.addEventListener("webglcontextlost", function (t) {
            t && t.preventDefault()
          }), n.addEventListener("webglcontextrestored", function (t) {
            for (var e = 0, n = r.restorables.length; e < n; e++) r.restorables[e].restore()
          })
        } else this.gl = t, this.canvas = this.gl.canvas
      }
      return t.prototype.addRestorable = function (t) {
        this.restorables.push(t)
      }, t.prototype.removeRestorable = function (t) {
        var e = this.restorables.indexOf(t);
        e > -1 && this.restorables.splice(e, 1)
      }, t
    }();
    e.ManagedWebGLRenderingContext = r;
    var n = function () {
      function e() {}
      return e.getDestGLBlendMode = function (r) {
        switch (r) {
          case t.BlendMode.Normal:
            return e.ONE_MINUS_SRC_ALPHA;
          case t.BlendMode.Additive:
            return e.ONE;
          case t.BlendMode.Multiply:
            return e.ONE_MINUS_SRC_ALPHA;
          case t.BlendMode.Screen:
            return e.ONE_MINUS_SRC_ALPHA;
          default:
            throw new Error("Unknown blend mode: " + r)
        }
      }, e.getSourceGLBlendMode = function (r, n) {
        switch (void 0 === n && (n = !1), r) {
          case t.BlendMode.Normal:
            return n ? e.ONE : e.SRC_ALPHA;
          case t.BlendMode.Additive:
            return n ? e.ONE : e.SRC_ALPHA;
          case t.BlendMode.Multiply:
            return e.DST_COLOR;
          case t.BlendMode.Screen:
            return e.ONE;
          default:
            throw new Error("Unknown blend mode: " + r)
        }
      }, e.ZERO = 0, e.ONE = 1, e.SRC_COLOR = 768, e.ONE_MINUS_SRC_COLOR = 769, e.SRC_ALPHA = 770, e.ONE_MINUS_SRC_ALPHA = 771, e.DST_ALPHA = 772, e.ONE_MINUS_DST_ALPHA = 773, e.DST_COLOR = 774, e
    }();
    e.WebGLBlendModeConverter = n
  })(e = t.webgl || (t.webgl = {}))
})(spine || (spine = {}));
export {
  spine
};