#!/bin/bash
#sudo chmod 777 /home/centos/confAws.sh
#cd /home/centos/
#./confAws.sh

echo "{
    \"agent\": {
        \"metrics_collection_interval\": 10,
        \"logfile\": \"/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log\",
        \"run_as_user\": \"root\"
    },
    \"logs\": {
        \"logs_collected\": {
            \"files\": {
                \"collect_list\": [
                    {
                        \"file_path\": \"/home/centos/ccwebapp/webapp/app_psql/logs/info.log\",
                        \"log_group_name\": \"csye6225_fall2019\",
                        \"log_stream_name\": \"webapp\"
                    }
                ]
            }
        },
        \"log_stream_name\": \"cloudwatch_log_stream\"
    },
    \"metrics\":{
        \"metrics_collected\":{
            \"statsd\":{
                \"service_address\":\":8125\",
                \"metrics_collection_interval\":10,
                \"metrics_aggregation_interval\":0
            }
        }
    }
}" > /opt/cloudwatch-config.json