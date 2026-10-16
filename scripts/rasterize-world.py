#!/usr/bin/env python3
# Usage: python3 -I scripts/rasterize-world.py path/to/land-110m.json > world-dots.json
# Source: the world-atlas npm package (land-110m.json). The output feeds
# src/sections/showcase/world-dots.ts.
"""Rasterise a TopoJSON land layer into a dot grid, emitted as hex rows."""
import json
import sys

STEP = 2.5
LON0, COLS = -180 + STEP / 2, int(360 / STEP)          # 144 columns
LAT_TOP, LAT_BOTTOM = 81.25, -56.25                    # skip Antarctica
ROWS = int(round((LAT_TOP - LAT_BOTTOM) / STEP)) + 1   # 56 rows


def decode_arcs(topo):
    (sx, sy), (tx, ty) = topo["transform"]["scale"], topo["transform"]["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    return arcs


def ring(arcs, indexes):
    pts = []
    for i in indexes:
        a = arcs[i] if i >= 0 else list(reversed(arcs[~i]))
        pts.extend(a if not pts else a[1:])
    return pts


def polygons(topo, arcs):
    for geom in topo["objects"]["land"]["geometries"]:
        if geom["type"] == "Polygon":
            yield [ring(arcs, r) for r in geom["arcs"]]
        elif geom["type"] == "MultiPolygon":
            for poly in geom["arcs"]:
                yield [ring(arcs, r) for r in poly]


def inside(x, y, pts):
    hit = False
    j = len(pts) - 1
    for i in range(len(pts)):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            hit = not hit
        j = i
    return hit


def unwrap(pts):
    """A ring that crosses the antimeridian jumps from +180 to -180. Shift its
    far-western points (beyond -90) east by 360 so it is one contiguous shape; points are then
    tested at both lon and lon + 360."""
    if all(abs(pts[i][0] - pts[i - 1][0]) < 180 for i in range(1, len(pts))):
        return pts
    return [(x + 360 if x < -90 else x, y) for x, y in pts]


def main(path):
    topo = json.load(open(path))
    arcs = decode_arcs(topo)
    rings = [unwrap(r) for poly in polygons(topo, arcs) for r in poly]
    rows, land = [], 0
    for r in range(ROWS):
        lat = LAT_TOP - r * STEP
        bits = 0
        for c in range(COLS):
            lon = LON0 + c * STEP
            # Even-odd across every ring handles holes (lakes) too.
            hit = sum(
                inside(lon, lat, ring_) or inside(lon + 360, lat, ring_)
                for ring_ in rings
            ) % 2 == 1
            if hit:
                bits |= 1 << (COLS - 1 - c)
                land += 1
        rows.append(f"{bits:0{COLS // 4}x}")
    json.dump({"step": STEP, "lon0": LON0, "latTop": LAT_TOP, "cols": COLS,
               "rows": rows, "land": land}, sys.stdout)


main(sys.argv[1])
