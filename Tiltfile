k8s_yaml([
  './packages/infra/k8s/client.yml',
  './packages/infra/k8s/auth-mongo.yml',
  './packages/infra/k8s/auth-service.yml',
  './packages/infra/k8s/mongo-pvc.yml',
  './packages/infra/k8s/ingress.yml',
])

docker_build(
  'pramindanata/tix-client',
  'packages/client',
  dockerfile='./packages/client/DockerfileDev',
  live_update=[
    sync('./packages/client', '/app'),
    run('cd /app && npm install --only prod', trigger=[
      'packages/client/package.json',
      'packages/client/package-lock.json'
    ])
  ]
)

docker_build(
  'pramindanata/tix-auth',
  'packages/auth',
  dockerfile='./packages/auth/DockerfileDev',
  live_update=[
    sync('./packages/auth', '/app'),
    npmInstallTrigger()
  ]
)

docker_build(
  'pramindanata/tix-common',
  'package/common',
  dockerfile='./packages/common/Dockerfile',
  live_update=[
    sync('./packages/common', '/app')
  ]
)

def npmInstallTrigger():
  return run('cd /app && npm install --only prod', trigger=[
    'packages/auth/package.json',
    'packages/auth/package-lock.json'
  ])


k8s_resource('auth-mongo', port_forwards='9001:27017')