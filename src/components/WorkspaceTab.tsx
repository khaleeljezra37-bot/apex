import { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Box, 
  Cloud, 
  Sun, 
  Gamepad2, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';

interface InstanceNode {
  id: string;
  name: string;
  type: 'folder' | 'script' | 'model' | 'service';
  icon: any;
  children?: InstanceNode[];
}

const mockWorkspace: InstanceNode[] = [
  {
    id: 'workspace',
    name: 'Workspace',
    type: 'service',
    icon: Globe,
    children: [
      { id: 'cam', name: 'Camera', type: 'model', icon: Box },
      { id: 'terrain', name: 'Terrain', type: 'model', icon: Box },
      { id: 'spawn', name: 'SpawnLocation', type: 'model', icon: Box },
    ]
  },
  {
    id: 'players',
    name: 'Players',
    type: 'service',
    icon: Gamepad2,
    children: [
      { id: 'player1', name: 'RobloxDev', type: 'model', icon: Box }
    ]
  },
  {
    id: 'lighting',
    name: 'Lighting',
    type: 'service',
    icon: Sun,
    children: [
      { id: 'sky', name: 'Sky', type: 'model', icon: Box },
      { id: 'blur', name: 'Blur', type: 'model', icon: Box },
    ]
  },
  {
    id: 'replicated_storage',
    name: 'ReplicatedStorage',
    type: 'service',
    icon: Cloud,
    children: [
      { id: 'common', name: 'Common', type: 'folder', icon: Folder },
      { id: 'events', name: 'Events', type: 'folder', icon: Folder },
    ]
  },
  {
    id: 'server_script_service',
    name: 'ServerScriptService',
    type: 'service',
    icon: FileCode,
    children: [
      { id: 'main', name: 'MainModule', type: 'script', icon: FileCode },
      { id: 'data', name: 'DataStoreManager', type: 'script', icon: FileCode },
    ]
  }
];

function Globe(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
}

function InstanceTreeItem({ node, level = 0 }: { node: InstanceNode, level?: number, key?: any }) {
  const [expanded, setExpanded] = useState(level === 0);
  const Icon = node.icon;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div 
        className="flex items-center py-1.5 px-2 hover:bg-white/10 rounded cursor-pointer group"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-4 h-4 mr-1 flex items-center justify-center">
          {hasChildren && (
            expanded ? <ChevronDown className="w-3.5 h-3.5 text-white/50" /> : <ChevronRight className="w-3.5 h-3.5 text-white/50" />
          )}
        </div>
        <Icon className="w-4 h-4 mr-2 text-[#4da6ff]" />
        <span className="text-[13px] text-white/90 select-none group-hover:text-white">{node.name}</span>
      </div>
      
      {expanded && hasChildren && (
        <div>
          {node.children!.map(child => (
            <InstanceTreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkspaceTab() {
  return (
    <div className="flex-1 h-full w-full border border-white/5 bg-[#0a0a0a] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative z-10 hidden sm:flex">
      <div className="p-4 border-b border-white/5 bg-[#111] flex items-center justify-between">
        <h2 className="font-bold text-[13px] uppercase tracking-widest text-white/80">Explorer</h2>
        <div className="bg-white/5 px-2 py-1 rounded text-[10px] text-white/40 tracking-wider">LIVE</div>
      </div>
      
      <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
        {mockWorkspace.map(node => (
          <InstanceTreeItem key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
