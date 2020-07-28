load('ext://namespace', 'namespace_create', 'namespace_inject')
ns = 'dev-git-tix'
namespace_create(ns)

k8s_yaml([
  namespace_inject(read_file('./infra/k8s/auth-mongo.yml'), ns),
  namespace_inject(read_file('./infra/k8s/auth-service.yml'), ns),
  namespace_inject(read_file('./infra/k8s/mongo-pvc.yml'), ns),
  namespace_inject(read_file('./infra/k8s/ingress.yml'), ns),
])

docker_build(
  'pramindanata/tix-auth',
  'auth',
  dockerfile='./auth/DockerfileDev',
  live_update=[
    sync('./auth', '/app'),
    run('cd /app && npm install --only=prod', trigger=[
      'auth/package.json',
      'auth/package-lock.json'
    ])
  ]
)

k8s_resource('auth-mongo', port_forwards='9001:27017')