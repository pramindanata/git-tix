k8s_yaml([
  './packages/infra/k8s/client.yml',
  './packages/infra/k8s/auth-mongo.yml',
  './packages/infra/k8s/auth-service.yml',
  './packages/infra/k8s/ticket-mongo.yml',
  './packages/infra/k8s/ticket-service.yml',
  './packages/infra/k8s/order-mongo.yml',
  './packages/infra/k8s/order-service.yml',
  './packages/infra/k8s/pvc.yml',
  './packages/infra/k8s/stan.yml',
  './packages/infra/k8s/ingress.yml',
])

docker_build(
  'pramindanata/tix-client',
  'packages/client',
  dockerfile='./packages/client/Dockerfile'
)

docker_build(
  'pramindanata/tix-auth',
  'packages/auth',
  dockerfile='./packages/auth/Dockerfile'
)

docker_build(
  'pramindanata/tix-ticket',
  'packages/ticket',
  dockerfile='./packages/ticket/Dockerfile'
)

docker_build(
  'pramindanata/tix-order',
  'packages/order',
  dockerfile='./packages/order/Dockerfile'
)

k8s_resource('auth-mongo', port_forwards='9001:27017')
k8s_resource('ticket-mongo', port_forwards='9002:27017')
k8s_resource('order-mongo', port_forwards='9003:27017')
k8s_resource('stan', port_forwards=['5001:4222', '6001:8222'])