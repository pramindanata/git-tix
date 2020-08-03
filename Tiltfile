k8s_yaml([
  './infra/k8s/client.yml',
  './infra/k8s/auth-mongo.yml',
  './infra/k8s/auth-service.yml',
  './infra/k8s/mongo-pvc.yml',
  './infra/k8s/ingress.yml',
])

docker_build(
  'pramindanata/tix-client',
  'client',
  dockerfile='./client/DockerfileDev',
  live_update=[
    sync('./client', '/app'),
    run('cd /app && npm install --only prod', trigger=[
      'client/package.json',
      'client/package-lock.json'
    ])
  ]
)

docker_build(
  'pramindanata/tix-auth',
  'auth',
  dockerfile='./auth/DockerfileDev',
  live_update=[
    sync('./auth', '/app'),
    run('cd /app && npm install --only prod', trigger=[
      'auth/package.json',
      'auth/package-lock.json'
    ])
  ]
)

k8s_resource('auth-mongo', port_forwards='9001:27017')