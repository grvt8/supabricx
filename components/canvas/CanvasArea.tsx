"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

import UniversalNode from './nodes/UniversalNode';
import { getNodeConfig } from './constants';

export interface CanvasApi {
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
}

interface CanvasAreaProps {
  onNodeSelect?: (node: Node | null) => void;
  onRegisterApi?: (api: CanvasApi) => void;
}

const initialNodes: Node[] = [
  {
    id: 'gateway-1',
    type: 'universal',
    position: { x: 250, y: 50 },
    data: { label: 'API Gateway', iconName: 'Shield', color: '#FF2F9F', type: 'API Gateway', routes: '12 routes', rateLimit: '1000 req/min' },
  },
  {
    id: 'service-1',
    type: 'universal',
    position: { x: 100, y: 250 },
    data: { label: 'Auth Service', iconName: 'Cube', color: '#FF2F9F', language: 'Node.js', port: ':3000', status: 'ok', instances: 2 },
  },
  {
    id: 'service-2',
    type: 'universal',
    position: { x: 400, y: 250 },
    data: { label: 'Payment Service', iconName: 'Cube', color: '#FF2F9F', language: 'Go', port: ':8080', status: 'ok', instances: 3 },
  },
  {
    id: 'db-1',
    type: 'universal',
    position: { x: 100, y: 450 },
    data: { label: 'Users DB', iconName: 'Database', color: '#2FC1FF', imageSrc: '/postgresql.png', type: 'PostgreSQL', connection: 'postgres://...', storage: '50GB', replicas: '1 primary' },
  },
  {
    id: 'db-2',
    type: 'universal',
    position: { x: 400, y: 450 },
    data: { label: 'Cache', iconName: 'Database', color: '#2FC1FF', imageSrc: '/redis.png', type: 'Redis', connection: 'redis://...', storage: '2GB', replicas: '1 node' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'gateway-1', target: 'service-1', animated: true, style: { stroke: '#a3a3a3' } },
  { id: 'e1-3', source: 'gateway-1', target: 'service-2', animated: true, style: { stroke: '#a3a3a3' } },
  { id: 'e2-4', source: 'service-1', target: 'db-1', style: { stroke: '#a3a3a3' } },
  { id: 'e3-5', source: 'service-2', target: 'db-2', style: { stroke: '#a3a3a3', strokeDasharray: '5,5' } },
];

export default function CanvasArea({ onNodeSelect, onRegisterApi }: CanvasAreaProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const nodesRef = useRef(nodes);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const updateNodeData = useCallback((nodeId: string, data: Record<string, unknown>) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)),
    );
  }, [setNodes]);

  useEffect(() => {
    if (!onRegisterApi) return;
    onRegisterApi({ updateNodeData });
  }, [onRegisterApi, updateNodeData]);

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

      // Get configuration from constants
      const config = getNodeConfig(typeLabel);
      
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'universal',
        position,
        data: { 
          label: typeLabel,
          iconName: config?.iconName || 'Cube',
          color: config?.color || '#000000',
          imageSrc: config?.imageSrc,
          // Add default properties based on type
          ...config
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    if (onNodeSelect) {
      onNodeSelect(null);
    }
  }, [onNodeSelect]);

  const nodeTypes = useMemo(() => ({
    universal: UniversalNode,
    // Map legacy types to universal node to ensure consistent styling
    service: UniversalNode,
    database: UniversalNode,
    gateway: UniversalNode,
    base: UniversalNode,
  }), []);

  return (
    <div className="flex-1 h-full w-full bg-canvas-bg relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
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
