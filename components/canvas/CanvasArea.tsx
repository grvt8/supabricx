"use client";

import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ServiceNode from './nodes/ServiceNode';
import DatabaseNode from './nodes/DatabaseNode';
import GatewayNode from './nodes/GatewayNode';
import BaseNode from './nodes/BaseNode';
import { NODE_DEFAULTS } from './nodeDefaults';

const initialNodes: Node[] = [
  {
    id: 'gateway-1',
    type: 'gateway',
    position: { x: 250, y: 50 },
    data: { label: 'API Gateway', type: 'API Gateway', routes: '12 routes', rateLimit: '1000 req/min' },
  },
  {
    id: 'service-1',
    type: 'service',
    position: { x: 100, y: 250 },
    data: { label: 'Auth Service', language: 'Node.js', port: ':3000', status: 'ok', instances: 2 },
  },
  {
    id: 'service-2',
    type: 'service',
    position: { x: 400, y: 250 },
    data: { label: 'Payment Service', language: 'Go', port: ':8080', status: 'ok', instances: 3 },
  },
  {
    id: 'db-1',
    type: 'database',
    position: { x: 100, y: 450 },
    data: { label: 'Users DB', type: 'PostgreSQL', connection: 'postgres://...', storage: '50GB', replicas: '1 primary' },
  },
  {
    id: 'db-2',
    type: 'database',
    position: { x: 400, y: 450 },
    data: { label: 'Cache', type: 'Redis', connection: 'redis://...', storage: '2GB', replicas: '1 node' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'gateway-1', target: 'service-1', animated: true, style: { stroke: '#a3a3a3' } },
  { id: 'e1-3', source: 'gateway-1', target: 'service-2', animated: true, style: { stroke: '#a3a3a3' } },
  { id: 'e2-4', source: 'service-1', target: 'db-1', style: { stroke: '#a3a3a3' } },
  { id: 'e3-5', source: 'service-2', target: 'db-2', style: { stroke: '#a3a3a3', strokeDasharray: '5,5' } },
];

export default function CanvasArea() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: '#a3a3a3' } }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const typeLabel = event.dataTransfer.getData('application/reactflow');

      if (typeof typeLabel === 'undefined' || !typeLabel || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let nodeType = 'base';
      let nodeData: Record<string, unknown> = { label: typeLabel };

      if (NODE_DEFAULTS[typeLabel]) {
        const config = NODE_DEFAULTS[typeLabel];
        nodeType = config.type;
        nodeData = { ...config.data };
      } else {
        // Fallback for legacy items if any
        if (['Server', 'Function', 'Container'].includes(typeLabel)) {
          nodeType = 'service';
          nodeData = { ...nodeData, language: 'Node.js', port: ':8080', status: 'ok', instances: 1 };
        } else if (['PostgreSQL', 'Redis', 'S3 Bucket', 'Table'].includes(typeLabel)) {
          nodeType = 'database';
          nodeData = { ...nodeData, type: typeLabel, connection: 'conn://...', storage: '10GB', replicas: '1' };
        } else if (['API Gateway', 'Load Balancer', 'Firewall'].includes(typeLabel)) {
          nodeType = 'gateway';
          nodeData = { ...nodeData, type: typeLabel, routes: '0', rateLimit: '1000' };
        }
      }

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const nodeTypes = useMemo(() => ({
    service: ServiceNode,
    database: DatabaseNode,
    gateway: GatewayNode,
    base: BaseNode,
  }), []);

  return (
    <div className="flex-1 h-full w-full bg-[var(--color-background)] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-transparent"
        defaultEdgeOptions={{
            style: { stroke: '#a3a3a3', strokeWidth: 2 },
            animated: true,
        }}
      >
        <Background color="#a3a3a3" gap={20} size={1} />
        <Controls className="!bg-card-bg !border-border-dark !text-muted [&>button]:!border-border-dark [&>button:hover]:!bg-border-dark [&>button:hover]:!text-foreground" />
      </ReactFlow>
    </div>
  );
}
