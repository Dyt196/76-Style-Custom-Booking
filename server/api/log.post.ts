import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { level, message, data } = body

  const config = useRuntimeConfig()

  const client = new CloudWatchLogsClient({
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKey,
      secretAccessKey: config.awsSecretKey
    }
  })

  const streamMap: Record<string, string> = {
    trace: config.awsTraceStream,
    error: config.awsErrorStream,
    info: config.awsInfoStream,
    log: config.awsLogGroup  // optional main log
  }

  const streamName = streamMap[level] || config.awsInfoStream

  const command = new PutLogEventsCommand({
    logGroupName: config.awsLogGroup,
    logStreamName: streamName,
    logEvents: [
      {
        message: JSON.stringify({
          message,
          data,
          timestamp: new Date().toISOString(),
        }),
        timestamp: Date.now()
      }
    ]
  })

  try {
    await client.send(command)
    return { success: true }
  } catch (err) {
    console.error("CloudWatch Log Error:", err)
    return { success: false, error: "CloudWatch Error" }
  }
})
