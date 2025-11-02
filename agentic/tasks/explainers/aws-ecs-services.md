# AWS ECS Services

**Category:** Infrastructure  
**Official Docs:** [AWS ECS Services Documentation](https://docs.aws.amazon.com/ecs/latest/developerguide/ecs_services.html)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

AWS ECS Services manage long-running applications in Amazon ECS clusters. A service maintains the desired number of task instances running simultaneously, automatically restarting failed tasks and handling load balancing. Services provide high availability and scalability for containerized applications that need to run continuously.

Think of ECS Services as the hotel concierge for your containerized applications. They ensure the right number of containers are always running, handle guest (request) distribution through load balancers, and quickly replace any containers that check out unexpectedly.

---

## Why We're Using It In This Project

ECS Services provide reliable, scalable container management for our persistent applications:

- **High availability**: Automatic task replacement and health monitoring
- **Load balancing**: Distribute traffic across multiple task instances
- **Auto-scaling**: Adjust capacity based on demand or metrics
- **Rolling updates**: Zero-downtime deployments with health checks
- **Service discovery**: Automatic registration with load balancers
- **Integration**: Native AWS networking and security
- **Cost optimization**: Run only the required number of tasks
- **Monitoring**: Integration with CloudWatch and X-Ray

---

## How We'll Use It

ECS Services will manage our long-running applications with load balancing and auto-scaling:

**Example 1: API service configuration**
```json
{
    "cluster": "financial-prod-cluster",
    "serviceName": "financial-api-service",
    "taskDefinition": "financial-api:5",
    "desiredCount": 3,
    "launchType": "FARGATE",
    "platformVersion": "1.4.0",
    "networkConfiguration": {
        "awsvpcConfiguration": {
            "subnets": ["subnet-12345", "subnet-67890", "subnet-abcde"],
            "securityGroups": ["sg-api-service"],
            "assignPublicIp": "DISABLED"
        }
    },
    "loadBalancers": [
        {
            "targetGroupArn": "arn:aws:elasticloadbalancing:.../api-targets",
            "containerName": "api",
            "containerPort": 8000
        }
    ],
    "serviceRegistries": [
        {
            "registryArn": "arn:aws:servicediscovery:.../api-service"
        }
    ],
    "enableECSManagedTags": true,
    "propagateTags": "SERVICE"
}
```

**Example 2: Auto-scaling policy**
```json
{
    "policyName": "api-cpu-scaling",
    "policyType": "TargetTrackingScaling",
    "targetTrackingScalingPolicyConfiguration": {
        "targetValue": 70.0,
        "predefinedMetricSpecification": {
            "predefinedMetricType": "ECSServiceAverageCPUUtilization"
        },
        "scaleInCooldown": 300,
        "scaleOutCooldown": 60
    }
}
```

**Example 3: Rolling deployment**
```bash
# Update service with new task definition
aws ecs update-service \
    --cluster financial-prod-cluster \
    --service financial-api-service \
    --task-definition financial-api:6 \
    --force-new-deployment

# Monitor deployment progress
aws ecs describe-services \
    --cluster financial-prod-cluster \
    --services financial-api-service
```

**Example 4: Health checks and monitoring**
```json
{
    "healthCheckGracePeriodSeconds": 300,
    "placementConstraints": [],
    "placementStrategy": [
        {
            "type": "spread",
            "field": "attribute:ecs.availability-zone"
        }
    ],
    "serviceConnectConfiguration": {
        "enabled": true,
        "namespace": "financial-namespace",
        "services": [
            {
                "portName": "api",
                "discoveryName": "api-service"
            }
        ]
    }
}
```

---

## Key Concepts

- **Desired Count**: Target number of running tasks
- **Task Definition**: Template for tasks in the service
- **Load Balancer**: Distributes traffic across tasks
- **Service Discovery**: Automatic service registration
- **Rolling Updates**: Gradual replacement of tasks

---

## Alternatives We Considered

- **EC2 instances**: Manual server management
- **Kubernetes**: More complex for our needs
- **Lambda**: Not suitable for long-running services
- **Direct task management**: No high availability features

---

## Getting Started

1. **Create task definition**: Define your application container
2. **Create service**: Configure desired count and networking
3. **Set up load balancer**: Configure ALB/NLB for traffic distribution
4. **Configure auto-scaling**: Set up scaling policies
5. **Monitor service**: Use ECS console and CloudWatch

---

## Common Patterns & Best Practices

1. **Multiple AZ deployment**: Spread tasks across availability zones
2. **Health check configuration**: Proper timeout and interval settings
3. **Gradual deployments**: Use deployment configuration for safety
4. **Resource limits**: Set appropriate CPU/memory reservations
5. **Monitoring integration**: Enable CloudWatch and X-Ray

---

## Troubleshooting

**Issue 1:** Service stuck in draining state  
**Solution:** Check health checks and target group configuration

**Issue 2:** Tasks failing to start  
**Solution:** Review task definition and resource allocation

---

## Learning Resources

**Essential:**
- [ECS Services Documentation](https://docs.aws.amazon.com/ecs/latest/developerguide/ecs_services.html)
- [Creating Services](https://docs.aws.amazon.com/ecs/latest/developerguide/create-service.html)

**Recommended:**
- [ECS Service Load Balancing](https://docs.aws.amazon.com/ecs/latest/developerguide/service-load-balancing.html)
- [Auto Scaling Services](https://docs.aws.amazon.com/ecs/latest/developerguide/service-auto-scaling.html)

**Community:**
- [AWS ECS Blog](https://aws.amazon.com/blogs/containers/category/amazon-ecs/)
- [AWS Forums](https://forums.aws.amazon.com/forum.jspa?forumID=56)

---

**Related Technologies:**
- [AWS ECS Fargate](aws-ecs-fargate.md) - Compute engine
- [AWS ECS Task Definitions](aws-ecs-task-definitions.md) - Task templates
- [AWS ALB](https://docs.aws.amazon.com/elasticloadbalancing/) - Load balancing
- [AWS CloudWatch](https://docs.aws.amazon.com/cloudwatch/) - Monitoring
