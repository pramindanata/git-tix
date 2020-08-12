def genNpmInstallTrigger(app_folder_name):
  packageJsonPath = 'packages/{}/package.json'.format(app_folder_name)
  packageLockJsonPath = 'packages/{}/package-lock.json'.format(app_folder_name)

  return run('cd /app && npm install --only prod', trigger=[
    packageJsonPath,
    packageLockJsonPath
  ])

k8s_yaml([
  './packages/infra/k8s/client.yml',
  './packages/infra/k8s/auth-mongo.yml',
  './packages/infra/k8s/auth-service.yml',
  './packages/infra/k8s/ticket-mongo.yml',
  './packages/infra/k8s/ticket-service.yml',
  './packages/infra/k8s/pvc.yml',
  './packages/infra/k8s/stan.yml',
  './packages/infra/k8s/ingress.yml',
])

docker_build(
  'pramindanata/tix-client',
  'packages/client',
  dockerfile='./packages/client/DockerfileDev',
  live_update=[
    sync('./packages/client', '/app'),
    genNpmInstallTrigger('client')
  ]
)

docker_build(
  'pramindanata/tix-auth',
  'packages/auth',
  dockerfile='./packages/auth/DockerfileDev',
  live_update=[
    sync('./packages/auth', '/app'),
    genNpmInstallTrigger('auth')
  ]
)

docker_build(
  'pramindanata/tix-ticket',
  'packages/ticket',
  dockerfile='./packages/ticket/DockerfileDev',
  live_update=[
    sync('./packages/ticket', '/app'),
    genNpmInstallTrigger('ticket')
  ]
)

k8s_resource('auth-mongo', port_forwards='9001:27017')
k8s_resource('ticket-mongo', port_forwards='9002:27017')
k8s_resource('stan', port_forwards=['5001:4222', '6001:8222'])