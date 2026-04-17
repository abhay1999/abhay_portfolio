"use client"

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { Terminal, Cpu, Layers } from 'lucide-react'
import Reveal from '@/components/Reveal'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Seg  = { t: string; c: string }
type Line = Seg[]

const W = (t: string): Seg => ({ t, c: 'text-white' })
const G = (t: string): Seg => ({ t, c: 'text-emerald-400' })
const C = (t: string): Seg => ({ t, c: 'text-cyan-400' })
const Y = (t: string): Seg => ({ t, c: 'text-yellow-400' })
const R = (t: string): Seg => ({ t, c: 'text-red-400' })
const D = (t: string): Seg => ({ t, c: 'text-neutral-500' })
const B = (t: string): Seg => ({ t, c: 'text-blue-400' })
const L = (...segs: Seg[]): Line => segs

interface Entry {
  id:          number
  cmd:         string
  lines:       Line[]
  processing:  boolean
  processingMsg: string
  elapsedMs:   number
}

// ─── Command Delays & Processing Messages ─────────────────────────────────────

const CMD_META: Record<string, { delay: number; msg: string }> = {
  'help':                                    { delay: 80,  msg: 'loading help...'                     },
  'kubectl get pods':                        { delay: 450, msg: 'connecting to cluster...'            },
  'kubectl get pods -A':                     { delay: 520, msg: 'fetching all namespaces...'          },
  'kubectl get nodes':                       { delay: 350, msg: 'querying node status...'             },
  'kubectl get deployments':                 { delay: 380, msg: 'listing deployments...'              },
  'kubectl get services':                    { delay: 360, msg: 'resolving service endpoints...'      },
  'kubectl top pods':                        { delay: 750, msg: 'fetching metrics from server...'     },
  'kubectl get events':                      { delay: 420, msg: 'pulling cluster events...'           },
  'kubectl logs self-healer':                { delay: 600, msg: 'streaming container logs...'         },
  'kubectl apply -f self-healer.yaml':       { delay: 900, msg: 'applying manifests to cluster...'   },
  'helm list':                               { delay: 380, msg: 'querying helm releases...'           },
  'helm list -A':                            { delay: 400, msg: 'scanning all namespaces...'          },
  'helm status self-healing-platform':       { delay: 520, msg: 'fetching release details...'        },
  'docker ps':                               { delay: 220, msg: 'querying container runtime...'       },
  'docker images':                           { delay: 250, msg: 'listing local images...'             },
  'whoami':                                  { delay: 100, msg: 'resolving identity...'               },
}

// ─── Command Outputs ───────────────────────────────────────────────────────────

const CMDS: Record<string, Line[]> = {
  help: [
    L(G('┌─ Available Commands ────────────────────────────────────────────────┐')),
    L(G('│')),
    L(G('│  '), C('kubectl get pods'), W('           '), D('default namespace pods')),
    L(G('│  '), C('kubectl get pods -A'), W('        '), D('all namespaces')),
    L(G('│  '), C('kubectl get nodes'), W('          '), D('node status')),
    L(G('│  '), C('kubectl get deployments'), W('    '), D('deployment rollout')),
    L(G('│  '), C('kubectl get services'), W('       '), D('service endpoints')),
    L(G('│  '), C('kubectl top pods'), W('           '), D('CPU / memory usage')),
    L(G('│  '), C('kubectl get events'), W('         '), D('cluster events')),
    L(G('│  '), C('kubectl logs self-healer'), W('   '), D('controller logs (live demo)')),
    L(G('│  '), C('kubectl apply -f self-healer.yaml'), D(' deploy manifests')),
    L(G('│')),
    L(G('│  '), C('helm list'), W('                 '), D('helm releases')),
    L(G('│  '), C('helm list -A'), W('              '), D('all namespaces')),
    L(G('│  '), C('helm status self-healing-platform'), D(' chart details')),
    L(G('│')),
    L(G('│  '), C('docker ps'), W('                 '), D('running containers')),
    L(G('│  '), C('docker images'), W('             '), D('local images')),
    L(G('│')),
    L(G('│  '), C('whoami'), W('  '), D('identity   ·  '), C('clear'), D('  clear screen (ctrl+l)')),
    L(G('└─────────────────────────────────────────────────────────────────────┘')),
  ],

  'kubectl get pods': [
    L(D('NAME                                           READY   STATUS    RESTARTS   AGE')),
    L(G('self-healer-controller-7d4b9f56c-xk2p9   '), W('  1/1     '), G('Running'), W('   0          3d12h')),
    L(G('self-healer-agent-ds-node01              '), W('  1/1     '), G('Running'), W('   0          3d12h')),
    L(G('self-healer-agent-ds-node02              '), W('  1/1     '), G('Running'), W('   0          3d12h')),
    L(G('prometheus-kube-prometheus-0             '), W('  2/2     '), G('Running'), W('   0          3d12h')),
    L(G('alertmanager-main-0                      '), W('  2/2     '), G('Running'), W('   0          3d12h')),
    L(G('grafana-7c9d8f5b6-m2n8k                 '), W('  1/1     '), G('Running'), W('   0          3d12h')),
    L(G('node-exporter-ds-node01                  '), W('  1/1     '), G('Running'), W('   0          3d12h')),
    L(G('node-exporter-ds-node02                  '), W('  1/1     '), G('Running'), W('   0          3d12h')),
    L(),
    L(G('✓ '), W('8/8 pods healthy'), D('  ·  namespace: default')),
  ],

  'kubectl get pods -A': [
    L(D('NAMESPACE    NAME                                           READY   STATUS')),
    L(W('default    '), G('  self-healer-controller-7d4b9f56c-xk2p9   '), W('1/1   '), G('Running')),
    L(W('default    '), G('  self-healer-agent-ds-node01              '), W('1/1   '), G('Running')),
    L(W('default    '), G('  self-healer-agent-ds-node02              '), W('1/1   '), G('Running')),
    L(W('monitoring '), G('  prometheus-kube-prometheus-0             '), W('2/2   '), G('Running')),
    L(W('monitoring '), G('  alertmanager-main-0                      '), W('2/2   '), G('Running')),
    L(W('monitoring '), G('  grafana-7c9d8f5b6-m2n8k                 '), W('1/1   '), G('Running')),
    L(W('monitoring '), G('  node-exporter-ds-node01                  '), W('1/1   '), G('Running')),
    L(W('kube-system'), G('  coredns-5d78c9869d-x2k9p                '), W('1/1   '), G('Running')),
    L(W('kube-system'), G('  kube-proxy-node01                        '), W('1/1   '), G('Running')),
    L(W('ingress    '), G('  ingress-nginx-controller-6c8f9b-m2n8k   '), W('1/1   '), G('Running')),
    L(),
    L(G('✓ '), W('10/10 pods healthy'), D('  ·  all namespaces')),
  ],

  'kubectl get nodes': [
    L(D('NAME           STATUS   ROLES           AGE   VERSION')),
    L(G('k8s-master   '), W('  '), G('Ready'), W('    control-plane   7d    v1.28.2')),
    L(G('k8s-worker-1 '), W('  '), G('Ready'), W('    <none>          7d    v1.28.2')),
    L(G('k8s-worker-2 '), W('  '), G('Ready'), W('    <none>          7d    v1.28.2')),
    L(),
    L(G('✓ '), W('3/3 nodes Ready  '), D('·  k8s v1.28.2')),
  ],

  'kubectl get deployments': [
    L(D('NAME                        READY   UP-TO-DATE   AVAILABLE   AGE')),
    L(G('self-healer-controller   '), W('  1/1     1            1           3d12h')),
    L(G('grafana                  '), W('  1/1     1            1           3d12h')),
    L(G('ingress-nginx-controller '), W('  1/1     1            1           7d')),
    L(G('coredns                  '), W('  2/2     2            2           7d')),
    L(),
    L(G('✓ '), W('All deployments up-to-date')),
  ],

  'kubectl get services': [
    L(D('NAME                  TYPE          CLUSTER-IP      PORT(S)')),
    L(G('self-healer-svc    '), W('  ClusterIP    10.96.0.100     8080/TCP')),
    L(G('grafana            '), W('  NodePort     10.96.0.101     3000:32000/TCP')),
    L(G('prometheus-svc     '), W('  ClusterIP    10.96.0.102     9090/TCP')),
    L(G('alertmanager-svc   '), W('  ClusterIP    10.96.0.103     9093/TCP')),
    L(G('ingress-nginx      '), W('  LoadBalancer 10.96.0.104     80:32080/TCP')),
    L(G('kubernetes         '), W('  ClusterIP    10.96.0.1       443/TCP')),
  ],

  'kubectl top pods': [
    L(D('NAME                                           CPU(cores)   MEMORY(bytes)')),
    L(G('self-healer-controller-7d4b9f56c-xk2p9   '), W('  '), Y('12m'), W('          48Mi')),
    L(G('self-healer-agent-ds-node01              '), W('  '), G('8m'), W('           32Mi')),
    L(G('self-healer-agent-ds-node02              '), W('  '), G('9m'), W('           31Mi')),
    L(G('prometheus-kube-prometheus-0             '), W('  '), Y('45m'), W('          312Mi')),
    L(G('alertmanager-main-0                      '), W('  '), G('5m'), W('           28Mi')),
    L(G('grafana-7c9d8f5b6-m2n8k                 '), W('  '), Y('22m'), W('          96Mi')),
    L(G('node-exporter-ds-node01                  '), W('  '), G('3m'), W('           16Mi')),
    L(),
    L(D('Cluster total:  CPU '), Y('104m / 6000m'), D('  Memory '), G('563Mi / 12288Mi')),
  ],

  'kubectl get events': [
    L(D('LAST SEEN   TYPE      REASON         OBJECT                            MESSAGE')),
    L(W('2m        '), G('  Normal  '), W('  Scheduled   '), W('  pod/self-healer-agent-ds-node01  '), D('Assigned to k8s-worker-1')),
    L(W('2m        '), G('  Normal  '), W('  Pulled      '), W('  pod/self-healer-agent-ds-node01  '), D('Image already present')),
    L(W('2m        '), G('  Normal  '), W('  Started     '), W('  pod/self-healer-agent-ds-node01  '), D('Started container')),
    L(W('8m        '), Y('  Warning '), W('  BackOff     '), W('  pod/demo-app-5f9d7c-xyz          '), R('Back-off restarting failed container')),
    L(W('8m        '), G('  Normal  '), W('  SelfHealed  '), W('  pod/demo-app-5f9d7c-xyz          '), G('Auto-healed by self-healer-controller')),
    L(W('8m        '), G('  Normal  '), W('  Killing     '), W('  pod/demo-app-5f9d7c-xyz          '), D('Stopping container (remediation)')),
    L(W('8m        '), G('  Normal  '), W('  Pulled      '), W('  pod/demo-app-5f9d7c-xyz          '), D('Successfully pulled image')),
    L(W('8m        '), G('  Normal  '), W('  Started     '), W('  pod/demo-app-5f9d7c-xyz          '), G('Container restarted successfully')),
    L(),
    L(G('✓ '), W('47 auto-remediations total'), D('  ·  last 24h')),
  ],

  'kubectl logs self-healer': [
    L(D('2025/01/10 11:20:01 '), G('[INFO]  '), W('Self-Healing Controller v1.2.0 starting...')),
    L(D('2025/01/10 11:20:01 '), G('[INFO]  '), W('Connected to cluster: '), G('self-healing-k8s')),
    L(D('2025/01/10 11:20:02 '), G('[INFO]  '), W('Watching namespaces: '), C('default, monitoring, ingress')),
    L(D('2025/01/10 11:20:02 '), G('[INFO]  '), W('Loaded 12 healing rules from config')),
    L(D('2025/01/10 11:20:05 '), G('[INFO]  '), W('Health check passed: '), G('8/8 pods healthy')),
    L(D('2025/01/10 11:28:15 '), Y('[WARN]  '), W('Pod '), Y('demo-app-5f9d7c-xyz'), W(' entered CrashLoopBackOff')),
    L(D('2025/01/10 11:28:15 '), G('[INFO]  '), W('Rule matched: '), C('crash-loop-restart')),
    L(D('2025/01/10 11:28:15 '), G('[INFO]  '), W('Triggering remediation → restart pod')),
    L(D('2025/01/10 11:28:16 '), G('[INFO]  '), W('Remediation successful '), G('✓'), W('  (attempt 1/3)')),
    L(D('2025/01/10 11:28:16 '), G('[INFO]  '), W('Total remediations: '), G('47'), W('  (today)')),
    L(D('2025/01/10 14:32:05 '), G('[INFO]  '), W('Health check passed: '), G('8/8 pods healthy')),
  ],

  'kubectl apply -f self-healer.yaml': [
    L(D('Applying manifests to cluster self-healing-k8s...')),
    L(),
    L(G('namespace/self-healing'), W(' created')),
    L(G('serviceaccount/self-healer'), W(' configured')),
    L(G('clusterrole.rbac.authorization.k8s.io/self-healer'), W(' configured')),
    L(G('clusterrolebinding.rbac.authorization.k8s.io/self-healer'), W(' configured')),
    L(G('configmap/self-healer-config'), W(' configured')),
    L(G('deployment.apps/self-healer-controller'), W(' configured')),
    L(G('daemonset.apps/self-healer-agent'), W(' configured')),
    L(G('service/self-healer-svc'), W(' unchanged')),
    L(),
    L(W('Waiting for rollout... '), G('deployment.apps/self-healer-controller')),
    L(W('  '), D('Waiting for 1 pods to be ready...')),
    L(W('  '), G('✓'), W(' Pods are up to date.')),
    L(),
    L(G('✓ '), W('Deployment complete  '), D('·  revision 4  ·  0 errors')),
  ],

  'helm list': [
    L(D('NAME                   NAMESPACE    REV  STATUS    CHART                           APP')),
    L(G('self-healing-platform'), W('  default      3    '), G('deployed'), W('  self-healing-k8s-1.2.0          1.2.0')),
    L(G('kube-prometheus-stack'), W('  monitoring   1    '), G('deployed'), W('  kube-prometheus-stack-45.7.1    0.65.1')),
    L(G('ingress-nginx        '), W('  ingress      2    '), G('deployed'), W('  ingress-nginx-4.7.1             1.8.1')),
    L(),
    L(G('✓ '), W('3 releases  '), D('·  all deployed')),
  ],

  'helm list -A': [
    L(D('NAME                   NAMESPACE     REV  STATUS    CHART')),
    L(G('self-healing-platform'), W('  default       3    '), G('deployed'), W('  self-healing-k8s-1.2.0')),
    L(G('kube-prometheus-stack'), W('  monitoring    1    '), G('deployed'), W('  kube-prometheus-stack-45.7.1')),
    L(G('ingress-nginx        '), W('  ingress       2    '), G('deployed'), W('  ingress-nginx-4.7.1')),
    L(G('cert-manager         '), W('  cert-manager  1    '), G('deployed'), W('  cert-manager-1.12.3')),
    L(),
    L(G('✓ '), W('4 releases across all namespaces')),
  ],

  'helm status self-healing-platform': [
    L(G('NAME: '),          W('self-healing-platform')),
    L(G('DEPLOYED: '),      W('Fri Jan 10 14:32:05 2025')),
    L(G('NAMESPACE: '),     W('default')),
    L(G('STATUS: '),        G('deployed')),
    L(G('REVISION: '),      W('3')),
    L(G('CHART: '),         W('self-healing-k8s-1.2.0')),
    L(),
    L(C('  Grafana:       '), W('http://k8s-master:32000')),
    L(C('  Prometheus:    '), W('http://k8s-master:9090')),
    L(C('  Alertmanager:  '), W('http://k8s-master:9093')),
    L(C('  Healer API:    '), W('http://k8s-master:8080')),
    L(),
    L(W('  Auto-healing:    '), G('● ACTIVE')),
    L(W('  Healing rules:   '), W('12 configured')),
    L(W('  Remediations:    '), G('47 successful  '), D('(0 failed)')),
    L(W('  Restart policy:  '), Y('OnFailure (max: 3)')),
  ],

  'docker ps': [
    L(D('CONTAINER ID   IMAGE                    STATUS       PORTS                   NAMES')),
    L(G('a1b2c3d4e5f6'), W('   self-healer:1.2.0      '), G('Up 3 days'), W('    :8080->8080            self-healer')),
    L(G('b2c3d4e5f6a1'), W('   prom/prometheus:v2.47  '), G('Up 3 days'), W('    :9090->9090            prometheus')),
    L(G('c3d4e5f6a1b2'), W('   grafana/grafana:10.1   '), G('Up 3 days'), W('    :3000->3000            grafana')),
    L(G('d4e5f6a1b2c3'), W('   nginx:alpine           '), G('Up 7 days'), W('    :80->80                ingress-nginx')),
    L(),
    L(G('✓ '), W('4/4 containers running')),
  ],

  'docker images': [
    L(D('REPOSITORY             TAG           SIZE      CREATED')),
    L(G('self-healer         '), W('   1.2.0        '), G('28.4MB'), W('    3 days ago')),
    L(G('self-healer         '), W('   1.1.0        '), G('27.8MB'), W('    10 days ago')),
    L(G('prom/prometheus     '), W('   v2.47.0      '), Y('241MB'), W('     2 weeks ago')),
    L(G('grafana/grafana     '), W('   10.1.0       '), Y('388MB'), W('     2 weeks ago')),
    L(G('nginx               '), W('   alpine       '), G('23.4MB'), W('    1 month ago')),
    L(G('golang              '), W('   1.21-alpine  '), Y('226MB'), W('     1 month ago')),
  ],

  whoami: [
    L(C('User:      '), W('abhay  (DevOps / Go Engineer)')),
    L(C('Cluster:   '), G('self-healing-k8s-platform')),
    L(C('Context:   '), W('k8s-master:6443')),
    L(C('Namespace: '), W('default')),
    L(C('Access:    '), G('cluster-admin')),
    L(C('GitHub:    '), B('github.com/abhay1999')),
    L(C('Focus:     '), W('Kubernetes · Go · Open Source · CNCF')),
  ],
}

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const SUGGESTIONS = [
  { cmd: 'kubectl get pods',                  label: 'get pods'         },
  { cmd: 'kubectl top pods',                  label: 'top pods'         },
  { cmd: 'kubectl get events',                label: 'get events'       },
  { cmd: 'kubectl logs self-healer',          label: 'logs'             },
  { cmd: 'kubectl apply -f self-healer.yaml', label: 'apply'            },
  { cmd: 'helm list',                         label: 'helm list'        },
  { cmd: 'helm status self-healing-platform', label: 'helm status'      },
  { cmd: 'docker ps',                         label: 'docker ps'        },
  { cmd: 'whoami',                            label: 'whoami'           },
  { cmd: 'help',                              label: 'help'             },
]

// ─── DevEnv CLI ────────────────────────────────────────────────────────────────

const O = (t: string): Seg => ({ t, c: 'text-orange-400' })
const Am = (t: string): Seg => ({ t, c: 'text-amber-400' })

const DEVENV_META: Record<string, { delay: number; msg: string }> = {
  'help':                                    { delay: 80,  msg: 'loading help...'                },
  'devenv --help':                           { delay: 80,  msg: 'loading help...'                },
  'devenv stacks':                           { delay: 200, msg: 'fetching stack templates...'    },
  'devenv list':                             { delay: 380, msg: 'querying running environments...' },
  'devenv status dev-go-001':                { delay: 420, msg: 'fetching environment status...' },
  'devenv logs dev-go-001':                  { delay: 550, msg: 'streaming logs...'              },
  'devenv spin up --stack=go-postgres':      { delay: 1100, msg: 'provisioning environment...'  },
  'devenv spin up --stack=mern':             { delay: 1300, msg: 'provisioning environment...'  },
  'devenv spin up --stack=react':            { delay: 800,  msg: 'provisioning environment...'  },
  'devenv teardown dev-go-001':              { delay: 700,  msg: 'tearing down environment...'  },
  'devenv version':                          { delay: 100,  msg: 'reading version...'            },
}

const DEVENV_CMDS: Record<string, Line[]> = {
  help: [
    L(O('┌─ devenv CLI — Available Commands ────────────────────────────────────┐')),
    L(O('│')),
    L(O('│  '), C('devenv spin up --stack=go-postgres'), D('  spin up Go + PostgreSQL')),
    L(O('│  '), C('devenv spin up --stack=mern'),        D('       spin up MERN stack')),
    L(O('│  '), C('devenv spin up --stack=react'),       D('      spin up React + Vite')),
    L(O('│')),
    L(O('│  '), C('devenv list'),                        D('                  list running envs')),
    L(O('│  '), C('devenv status dev-go-001'),           D('       environment details')),
    L(O('│  '), C('devenv logs dev-go-001'),             D('         stream env logs')),
    L(O('│  '), C('devenv teardown dev-go-001'),         D('     tear down an env')),
    L(O('│  '), C('devenv stacks'),                      D('                list stack templates')),
    L(O('│  '), C('devenv version'),                     D('               CLI version')),
    L(O('│')),
    L(O('│  '), C('clear'), D('  clear screen  ·  '), C('help'), D('  show this menu')),
    L(O('└──────────────────────────────────────────────────────────────────────┘')),
  ],

  'devenv --help': [
    L(O('┌─ devenv CLI — Available Commands ────────────────────────────────────┐')),
    L(O('│')),
    L(O('│  '), C('devenv spin up --stack=go-postgres'), D('  spin up Go + PostgreSQL')),
    L(O('│  '), C('devenv spin up --stack=mern'),        D('       spin up MERN stack')),
    L(O('│  '), C('devenv spin up --stack=react'),       D('      spin up React + Vite')),
    L(O('│')),
    L(O('│  '), C('devenv list'),                        D('                  list running envs')),
    L(O('│  '), C('devenv status dev-go-001'),           D('       environment details')),
    L(O('│  '), C('devenv logs dev-go-001'),             D('         stream env logs')),
    L(O('│  '), C('devenv teardown dev-go-001'),         D('     tear down an env')),
    L(O('│  '), C('devenv stacks'),                      D('                list stack templates')),
    L(O('│  '), C('devenv version'),                     D('               CLI version')),
    L(O('│')),
    L(O('│  '), C('clear'), D('  clear screen  ·  '), C('help'), D('  show this menu')),
    L(O('└──────────────────────────────────────────────────────────────────────┘')),
  ],

  'devenv stacks': [
    L(D('NAME              DESCRIPTION                          SERVICES')),
    L(O('go-postgres    '), W('  Go app + PostgreSQL                  '), C('app, postgres')),
    L(O('mern           '), W('  MongoDB + Express + React + Node     '), C('mongo, api, web')),
    L(O('react          '), W('  React + Vite dev server              '), C('web')),
    L(O('go-mysql       '), W('  Go app + MySQL                       '), C('app, mysql')),
    L(O('django-pg      '), W('  Django + PostgreSQL + Redis          '), C('app, postgres, redis')),
    L(),
    L(D('Use: '), O('devenv spin up --stack='), C('<NAME>')),
  ],

  'devenv list': [
    L(D('ID               STACK          STATUS    AGE    PORTS')),
    L(O('dev-go-001    '), W('   go-postgres  '), G('  Running'), W('   4h     '), C(':8080, :5432')),
    L(O('dev-mern-002  '), W('   mern         '), G('  Running'), W('   2h     '), C(':3000, :5000, :27017')),
    L(O('dev-react-003 '), W('   react        '), G('  Running'), W('   45m    '), C(':5173')),
    L(),
    L(G('✓ '), W('3 environments running')),
  ],

  'devenv status dev-go-001': [
    L(O('Environment: '), W('dev-go-001')),
    L(O('Stack:       '), W('go-postgres')),
    L(O('Status:      '), G('Running')),
    L(O('Age:         '), W('4h 12m')),
    L(O('Namespace:   '), W('dev-go-001')),
    L(),
    L(D('Pods:')),
    L(W('  dev-go-001-app-x9k2p       '), G('Running'), W('   '), Am('12m CPU'), W('   64Mi Mem')),
    L(W('  dev-go-001-postgres-7f4b9c '), G('Running'), W('   '), G('8m CPU'),  W('   128Mi Mem')),
    L(),
    L(D('Port forwards:')),
    L(W('  :8080 → localhost:8080   '), D('(Go app)')),
    L(W('  :5432 → localhost:5432   '), D('(PostgreSQL)')),
  ],

  'devenv logs dev-go-001': [
    L(D('2025/01/10 14:32:01 '), O('[INFO]  '), W('devenv v1.0.0 — environment dev-go-001')),
    L(D('2025/01/10 14:32:01 '), O('[INFO]  '), W('Go app starting on :8080')),
    L(D('2025/01/10 14:32:01 '), O('[INFO]  '), W('Connecting to PostgreSQL...')),
    L(D('2025/01/10 14:32:02 '), G('[INFO]  '), W('Database connection established')),
    L(D('2025/01/10 14:32:02 '), G('[INFO]  '), W('Migrations: 3 applied')),
    L(D('2025/01/10 14:32:02 '), G('[INFO]  '), W('Server ready at http://0.0.0.0:8080')),
    L(D('2025/01/10 14:35:18 '), G('[INFO]  '), W('GET /health → '), G('200'), W(' (2ms)')),
    L(D('2025/01/10 14:36:05 '), G('[INFO]  '), W('GET /api/users → '), G('200'), W(' (8ms)')),
    L(D('2025/01/10 14:41:33 '), G('[INFO]  '), W('POST /api/data → '), G('201'), W(' (14ms)')),
    L(D('2025/01/10 14:58:07 '), Y('[WARN]  '), W('Slow query detected: '), Y('42ms')),
    L(D('2025/01/10 15:02:44 '), G('[INFO]  '), W('GET /health → '), G('200'), W(' (1ms)')),
  ],

  'devenv spin up --stack=go-postgres': [
    L(O('Generating environment ID: '), G('dev-go-004')),
    L(),
    L(G('✓ '), W('Namespace '), O('dev-go-004'), W(': Created')),
    L(G('✓ '), W('Applying stack template: '), C('go-postgres-v1.2')),
    L(G('✓ '), W('Pulling '), C('golang:1.21-alpine'), W(' (cached)')),
    L(G('✓ '), W('Pulling '), C('postgres:15-alpine'), W(' (cached)')),
    L(G('✓ '), W('PostgreSQL pod: '), G('Running'), D('  (dev-go-004-postgres-3k9p1)')),
    L(G('✓ '), W('Go app pod:     '), G('Running'), D('  (dev-go-004-app-x7n2m)')),
    L(G('✓ '), W('Port-forwarding :5432 → localhost:5432')),
    L(G('✓ '), W('Port-forwarding :8080 → localhost:8080')),
    L(),
    L(G('● Environment ready in 11s')),
    L(),
    L(C('  Connect:  '), W('psql -h localhost -p 5432 -U dev -d devdb')),
    L(C('  App:      '), W('http://localhost:8080')),
  ],

  'devenv spin up --stack=mern': [
    L(O('Generating environment ID: '), G('dev-mern-005')),
    L(),
    L(G('✓ '), W('Namespace '), O('dev-mern-005'), W(': Created')),
    L(G('✓ '), W('Applying stack template: '), C('mern-v2.1')),
    L(G('✓ '), W('MongoDB pod:         '), G('Running'), D('  (dev-mern-005-mongo-4f2a1c)')),
    L(G('✓ '), W('Express+Node pod:    '), G('Running'), D('  (dev-mern-005-api-m7p1q)')),
    L(G('✓ '), W('React+Vite pod:      '), G('Running'), D('  (dev-mern-005-web-k3n8r)')),
    L(G('✓ '), W('Port-forwarding :27017 → localhost:27017')),
    L(G('✓ '), W('Port-forwarding :5000  → localhost:5000')),
    L(G('✓ '), W('Port-forwarding :3000  → localhost:3000')),
    L(),
    L(G('● Environment ready in 18s')),
    L(),
    L(C('  MongoDB:   '), W('mongodb://localhost:27017/devdb')),
    L(C('  API:       '), W('http://localhost:5000')),
    L(C('  Frontend:  '), W('http://localhost:3000')),
  ],

  'devenv spin up --stack=react': [
    L(O('Generating environment ID: '), G('dev-react-006')),
    L(),
    L(G('✓ '), W('Namespace '), O('dev-react-006'), W(': Created')),
    L(G('✓ '), W('Applying stack template: '), C('react-v1.0')),
    L(G('✓ '), W('Pulling '), C('node:20-alpine'), W(' (cached)')),
    L(G('✓ '), W('React+Vite pod: '), G('Running'), D('  (dev-react-006-web-n8m2k)')),
    L(G('✓ '), W('Port-forwarding :5173 → localhost:5173')),
    L(),
    L(G('● Environment ready in 8s')),
    L(),
    L(C('  Dev server:  '), W('http://localhost:5173')),
  ],

  'devenv teardown dev-go-001': [
    L(Am('Tearing down '), O('dev-go-001'), Am('...')),
    L(),
    L(G('✓ '), W('Port-forwards stopped')),
    L(G('✓ '), W('Pods terminated')),
    L(G('✓ '), W('Namespace '), O('dev-go-001'), W(': Deleted')),
    L(),
    L(G('● Environment dev-go-001 torn down (2s)')),
    L(D('  Cleaned up: 2 pods, 1 namespace, 2 port-forwards')),
  ],

  'devenv version': [
    L(O('devenv '), W('v1.0.0'), D('  (go1.21.5, linux/amd64)')),
    L(O('Built:   '), W('2025-01-10')),
    L(O('Commit:  '), C('a3f2b1c')),
    L(O('GitHub:  '), B('github.com/abhay1999/dev-env-platform')),
  ],
}

const DEVENV_SUGGESTIONS = [
  { cmd: 'devenv stacks',                      label: 'stacks'           },
  { cmd: 'devenv spin up --stack=go-postgres', label: 'spin up go'       },
  { cmd: 'devenv spin up --stack=mern',        label: 'spin up mern'     },
  { cmd: 'devenv spin up --stack=react',       label: 'spin up react'    },
  { cmd: 'devenv list',                        label: 'list envs'        },
  { cmd: 'devenv status dev-go-001',           label: 'status'           },
  { cmd: 'devenv logs dev-go-001',             label: 'logs'             },
  { cmd: 'devenv teardown dev-go-001',         label: 'teardown'         },
  { cmd: 'devenv version',                     label: 'version'          },
  { cmd: 'help',                               label: 'help'             },
]

// ─── Component ────────────────────────────────────────────────────────────────

const DevOpsPlayground = () => {
  const [mode,       setMode]       = useState<'k8s' | 'devenv'>('k8s')
  const [entries,    setEntries]    = useState<Entry[]>([])
  const [visLines,   setVisLines]   = useState<Record<number, number>>({})
  const [input,      setInput]      = useState('')
  const [hist,       setHist]       = useState<string[]>([])
  const [histIdx,    setHistIdx]    = useState(-1)
  const [focused,    setFocused]    = useState(false)
  const [busy,       setBusy]       = useState(false)
  const [spinFrame,  setSpinFrame]  = useState(0)
  const outputRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const idRef      = useRef(0)
  const busyRef    = useRef(false)

  const activeCmds = mode === 'k8s' ? CMDS : DEVENV_CMDS
  const activeMeta = mode === 'k8s' ? CMD_META : DEVENV_META
  const activeSuggestions = mode === 'k8s' ? SUGGESTIONS : DEVENV_SUGGESTIONS

  useEffect(() => {
    setEntries([])
    setVisLines({})
    setInput('')
    setHist([])
    setHistIdx(-1)
    busyRef.current = false
    setBusy(false)
  }, [mode])

  const anyProcessing = entries.some(e => e.processing)
  useEffect(() => {
    if (!anyProcessing) return
    const t = setInterval(() => setSpinFrame(f => (f + 1) % SPINNER_FRAMES.length), 80)
    return () => clearInterval(t)
  }, [anyProcessing])

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [entries, visLines])

  const streamLines = useCallback((entryId: number, lines: Line[]) => {
    lines.forEach((_, i) => {
      setTimeout(() => {
        setVisLines(prev => ({ ...prev, [entryId]: i + 1 }))
      }, i * 28)
    })
    setTimeout(() => {
      busyRef.current = false
      setBusy(false)
    }, lines.length * 28 + 50)
  }, [])

  const execCmd = useCallback((cmd: string) => {
    const meta = activeMeta[cmd] ?? { delay: 200, msg: 'running...' }
    const lines = activeCmds[cmd] ?? [
      L(R('bash: '), W(`${cmd.split(' ')[0]}: command not found`)),
      L(D('type '), C('help'), D(' to see available commands')),
    ]
    const id = ++idRef.current
    const startedAt = Date.now()

    setEntries(prev => [...prev, { id, cmd, lines, processing: true, processingMsg: meta.msg, elapsedMs: 0 }])
    setHist(prev => [cmd, ...prev.filter(c => c !== cmd).slice(0, 49)])
    setHistIdx(-1)
    setInput('')

    setTimeout(() => {
      const elapsed = Date.now() - startedAt
      setEntries(prev => prev.map(e => e.id === id ? { ...e, processing: false, elapsedMs: elapsed } : e))
      streamLines(id, lines)
    }, meta.delay)
  }, [streamLines, activeMeta, activeCmds])

  const typeAndExec = useCallback((cmd: string) => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setInput('')

    const chars = cmd.split('')
    chars.forEach((_, i) => {
      setTimeout(() => setInput(cmd.slice(0, i + 1)), i * 38)
    })
    setTimeout(() => {
      setInput('')
      execCmd(cmd)
    }, chars.length * 38 + 180)
  }, [execCmd])

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (busy) return
    if (e.key === 'Enter') {
      if (!input.trim()) return
      busyRef.current = true
      setBusy(true)
      execCmd(input.trim())
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const ni = Math.min(histIdx + 1, hist.length - 1)
      setHistIdx(ni); setInput(hist[ni] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const ni = Math.max(histIdx - 1, -1)
      setHistIdx(ni); setInput(ni === -1 ? '' : hist[ni])
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([]); setVisLines({})
    }
  }

  return (
    <section id="playground" className="relative py-24 overflow-hidden bg-black">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(52,211,153,0.9) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.9) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/4 blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/4 blur-[130px]" />
        <div className="absolute top-[40%] left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent">
          <div className="trace-x-fwd absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <Reveal className="mb-10">
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-emerald-400">$</span>
            <span className="text-neutral-400">kubectl</span>
            <span className="text-neutral-600">--context=demo</span>
            <span className="text-white">›</span>
            <span className="text-emerald-400">playground</span>
            <span className="text-neutral-300">.start()</span>
            <span className="cursor-blink w-1.5 h-3.5 bg-emerald-400 inline-block ml-0.5" />
          </div>
          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">07.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">DevOps</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Playground</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
          <p className="text-sm text-neutral-600 mt-3 font-mono">
            Sandboxed terminal ·{' '}
            <span className="text-emerald-400">kubectl</span> ·{' '}
            <span className="text-cyan-400">helm</span> ·{' '}
            <span className="text-blue-400">docker</span>{' '}
            · click suggestions to watch commands run
          </p>
        </Reveal>

        {/* Terminal */}
        <Reveal
          from={{ opacity: 0, y: 30 }}
          delay={0.1}
          className="rounded-2xl border border-white/10 overflow-hidden bg-[#0a0a0a] shadow-[0_0_80px_-20px_rgba(52,211,153,0.2)]"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/80 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/90" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/90" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
              </div>
              <Terminal size={11} className="text-neutral-500" />
              <span className="font-mono text-[11px] text-neutral-400">
                {mode === 'k8s' ? 'abhay@self-healing-k8s — zsh' : 'abhay@dev-env-platform — zsh'}
              </span>
            </div>
            {/* Mode tabs */}
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <button
                onClick={() => setMode('k8s')}
                className={`px-2.5 py-1 rounded-md border transition-all duration-150 ${mode === 'k8s' ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400' : 'border-white/[0.07] text-neutral-600 hover:text-neutral-400 hover:border-white/15'}`}
              >K8s Platform</button>
              <button
                onClick={() => setMode('devenv')}
                className={`px-2.5 py-1 rounded-md border transition-all duration-150 ${mode === 'devenv' ? 'border-orange-500/60 bg-orange-500/10 text-orange-400' : 'border-white/[0.07] text-neutral-600 hover:text-neutral-400 hover:border-white/15'}`}
              >DevEnv CLI</button>
            </div>
            <div className="hidden sm:flex items-center gap-5 font-mono text-[10px]">
              {mode === 'k8s' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <Cpu size={9} className="text-emerald-400" />
                    <span className="text-neutral-600">cluster:</span>
                    <span className="text-emerald-400">self-healing-k8s</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers size={9} className="text-cyan-400" />
                    <span className="text-neutral-600">ns:</span>
                    <span className="text-cyan-400">default</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <Cpu size={9} className="text-orange-400" />
                    <span className="text-neutral-600">cli:</span>
                    <span className="text-orange-400">devenv v1.0.0</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers size={9} className="text-amber-400" />
                    <span className="text-neutral-600">envs:</span>
                    <span className="text-amber-400">3 running</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-1.5">
                <div className={`opacity-pulse w-1.5 h-1.5 rounded-full ${mode === 'k8s' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]' : 'bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)]'}`} />
                <span className={mode === 'k8s' ? 'text-emerald-400' : 'text-orange-400'}>CONNECTED</span>
              </div>
            </div>
          </div>

          {/* Output area */}
          <div
            ref={outputRef}
            className="h-[460px] overflow-y-auto px-5 py-4 font-mono text-[12px] leading-relaxed cursor-text"
            onClick={() => inputRef.current?.focus()}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}
          >
            {/* Welcome */}
            {entries.length === 0 && (
              <div className="mb-5">
                {mode === 'k8s' ? (
                  <>
                    <div className="text-emerald-400/60 text-[11px]">╔══════════════════════════════════════════════════════════════════╗</div>
                    <div className="text-[11px]">
                      <span className="text-emerald-400/60">║  </span>
                      <span className="text-white font-bold">    Self-Healing Kubernetes Platform  </span>
                      <span className="text-emerald-400/40 text-[10px]">  [SANDBOX]             </span>
                      <span className="text-emerald-400/60">║</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-emerald-400/60">║  </span>
                      <span className="text-neutral-500">    3 nodes · 8 pods running · 12 healing rules active        </span>
                      <span className="text-emerald-400/60">   ║</span>
                    </div>
                    <div className="text-emerald-400/60 text-[11px]">╚══════════════════════════════════════════════════════════════════╝</div>
                    <div className="mt-3 text-neutral-500">Click a <span className="text-emerald-400">suggestion</span> below to watch it run, or type a command.</div>
                    <div className="text-neutral-700 text-[11px] mt-0.5">↑ ↓ history  ·  ctrl+l clear  ·  15+ commands supported</div>
                  </>
                ) : (
                  <>
                    <div className="text-orange-400/60 text-[11px]">╔══════════════════════════════════════════════════════════════════╗</div>
                    <div className="text-[11px]">
                      <span className="text-orange-400/60">║  </span>
                      <span className="text-white font-bold">    Dev Environment Platform  </span>
                      <span className="text-orange-400/40 text-[10px]">  [SANDBOX]                      </span>
                      <span className="text-orange-400/60">║</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-orange-400/60">║  </span>
                      <span className="text-neutral-500">    3 envs running · go-postgres · mern · react stacks          </span>
                      <span className="text-orange-400/60"> ║</span>
                    </div>
                    <div className="text-orange-400/60 text-[11px]">╚══════════════════════════════════════════════════════════════════╝</div>
                    <div className="mt-3 text-neutral-500">Click a <span className="text-orange-400">suggestion</span> below to spin up an environment, or type a command.</div>
                    <div className="text-neutral-700 text-[11px] mt-0.5">↑ ↓ history  ·  ctrl+l clear  ·  10+ commands supported</div>
                  </>
                )}
              </div>
            )}

            {/* Entries */}
            {entries.map(entry => {
              const visible = visLines[entry.id] ?? 0
              return (
                <div key={entry.id} className="mb-4">
                  {/* Prompt */}
                  <div className="flex items-center gap-1 select-none mb-0.5 flex-wrap">
                    <span className={mode === 'k8s' ? 'text-emerald-400' : 'text-orange-400'}>abhay</span>
                    <span className="text-neutral-600">@</span>
                    <span className={mode === 'k8s' ? 'text-cyan-400' : 'text-amber-400'}>{mode === 'k8s' ? 'k8s-master' : 'dev-env'}</span>
                    <span className="text-neutral-600">:</span>
                    <span className="text-purple-400">~</span>
                    <span className="text-neutral-500">$</span>
                    <span className="text-white ml-1">{entry.cmd}</span>
                  </div>

                  {/* Processing spinner */}
                  {entry.processing && (
                    <div className="flex items-center gap-2 text-neutral-500 pl-1 py-0.5">
                      <span className={mode === 'k8s' ? 'text-emerald-400' : 'text-orange-400'}>{SPINNER_FRAMES[spinFrame]}</span>
                      <span>{entry.processingMsg}</span>
                    </div>
                  )}

                  {/* Streamed output */}
                  {!entry.processing && (
                    <>
                      {entry.lines.slice(0, visible).map((line, li) => (
                        <div key={li} className="whitespace-pre leading-[1.65]">
                          {line.length === 0
                            ? <span>&nbsp;</span>
                            : line.map((seg, si) => <span key={si} className={seg.c}>{seg.t}</span>)
                          }
                        </div>
                      ))}
                      {/* Elapsed time */}
                      {visible >= entry.lines.length && entry.elapsedMs > 0 && (
                        <div className="text-neutral-700 text-[10px] mt-0.5 pl-0.5 select-none">
                          ✓ exited 0  · took {entry.elapsedMs}ms
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}

            {/* Input row */}
            <div className="flex items-center gap-1">
              <span className={`select-none ${mode === 'k8s' ? 'text-emerald-400' : 'text-orange-400'}`}>abhay</span>
              <span className="text-neutral-600 select-none">@</span>
              <span className={`select-none ${mode === 'k8s' ? 'text-cyan-400' : 'text-amber-400'}`}>{mode === 'k8s' ? 'k8s-master' : 'dev-env'}</span>
              <span className="text-neutral-600 select-none">:</span>
              <span className="text-purple-400 select-none">~</span>
              <span className="text-neutral-500 select-none">$</span>
              <div className="relative flex-1 flex items-center ml-1">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => { if (!busy) setInput(e.target.value) }}
                  onKeyDown={onKey}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  readOnly={busy}
                  className={`bg-transparent outline-none text-white font-mono text-[12px] w-full ${mode === 'k8s' ? 'caret-emerald-400' : 'caret-orange-400'}`}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  aria-label="Terminal input"
                />
                {focused && input.length === 0 && !busy && (
                  <span className={`cursor-blink absolute left-0 top-0.5 w-[7px] h-[14px] pointer-events-none ${mode === 'k8s' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                )}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="border-t border-white/[0.05] bg-black/50 px-4 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest flex-shrink-0 mr-1">
                Quick run →
              </span>
              {activeSuggestions.map(s => (
                <button
                  key={s.cmd}
                  onClick={() => { typeAndExec(s.cmd); inputRef.current?.focus() }}
                  disabled={busy}
                  className={`group px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 ${mode === 'k8s' ? 'hover:border-emerald-500/50 hover:bg-emerald-500/5' : 'hover:border-orange-500/50 hover:bg-orange-500/5'}`}
                >
                  <span className={`font-mono text-[10px] text-neutral-400 transition-colors ${mode === 'k8s' ? 'group-hover:text-emerald-400' : 'group-hover:text-orange-400'}`}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Info strip */}
        <Reveal
          from={{ opacity: 0, y: 10 }}
          delay={0.3}
          className="mt-4 flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-neutral-700"
        >
          <span><span className={mode === 'k8s' ? 'text-emerald-500' : 'text-orange-500'}>●</span> Sandboxed demo environment</span>
          {mode === 'k8s' ? (
            <>
              <span><span className="text-cyan-500">●</span> Based on: abhay1999/self-healing-k8s-platform</span>
              <span><span className="text-purple-500">●</span> 15+ commands · kubectl · helm · docker</span>
            </>
          ) : (
            <>
              <span><span className="text-amber-500">●</span> Based on: abhay1999/dev-env-platform</span>
              <span><span className="text-purple-500">●</span> 10+ commands · devenv spin up · list · teardown</span>
            </>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default DevOpsPlayground
