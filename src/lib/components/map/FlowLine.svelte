<script lang="ts">
  import { Polyline, Tooltip } from 'sveaflet';
  import type { Coordinates } from '$lib/types';

  interface Props {
    from: Coordinates;
    to: Coordinates;
    label?: string;
    percentage?: number;
    highlighted?: boolean;
  }

  let { from, to, label, percentage, highlighted = false }: Props = $props();

  // Create smooth curved path using quadratic Bezier interpolation
  const curvedPath = $derived(() => {
    const start: [number, number] = [from.lat, from.lng];
    const end: [number, number] = [to.lat, to.lng];

    // Calculate control point with offset for curve
    const midLat = (from.lat + to.lat) / 2;
    const midLng = (from.lng + to.lng) / 2;

    // Add curvature based on distance
    const distance = Math.sqrt(
      Math.pow(to.lat - from.lat, 2) + Math.pow(to.lng - from.lng, 2)
    );
    const curveOffset = distance * 0.2; // Increased curvature

    // Offset perpendicular to the line for control point
    const dx = to.lng - from.lng;
    const dy = to.lat - from.lat;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    // Control point for quadratic Bezier
    const controlPoint: [number, number] = [
      midLat + (dx / len) * curveOffset,
      midLng - (dy / len) * curveOffset
    ];

    // Generate smooth curve using quadratic Bezier interpolation
    const numPoints = 20;
    const points: [number, number][] = [];

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const t1 = 1 - t;

      // Quadratic Bezier formula: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
      const lat = t1 * t1 * start[0] + 2 * t1 * t * controlPoint[0] + t * t * end[0];
      const lng = t1 * t1 * start[1] + 2 * t1 * t * controlPoint[1] + t * t * end[1];

      points.push([lat, lng]);
    }

    return points;
  });

  // Style options
  const options = $derived({
    color: highlighted ? '#f59e0b' : '#94a3b8',
    weight: highlighted ? 3 : 1.5,
    opacity: highlighted ? 0.9 : 0.4,
    dashArray: highlighted ? undefined : '5, 5',
    smoothFactor: 1
  });

  // Tooltip text
  const tooltipText = $derived(() => {
    if (label && percentage) {
      return `${label}: ${percentage}%`;
    }
    return label || 'Material flow';
  });
</script>

<Polyline latLngs={curvedPath()} {options}>
  {#if label}
    <Tooltip options={{ permanent: false, sticky: true }}>
      {tooltipText()}
    </Tooltip>
  {/if}
</Polyline>
