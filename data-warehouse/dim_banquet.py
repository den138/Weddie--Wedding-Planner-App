# Import environment
from pyspark.sql.functions import lit
import os
from pyspark.sql import SparkSession
# import pyspark.sql.functions as F
import findspark
findspark.init('/opt/bitnami/spark')


AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')

RDS_DB = os.getenv('RDS_DB')
RDS_USERNAME = os.getenv('RDS_USERNAME')
RDS_PASSWORD = os.getenv('RDS_PASSWORD')
RDS_HOST = os.getenv('RDS_HOST')

packages = [
    "com.amazonaws:aws-java-sdk-s3:1.12.95",
    "org.apache.hadoop:hadoop-aws:3.2.0",
    "org.apache.spark:spark-avro_2.12:2.4.4",
    "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1",
    "org.postgresql:postgresql:42.2.18"

]

spark = SparkSession.builder.appName("connect to RDS dw")\
    .master('spark://172.1.0.2:7077')\
    .config("spark.jars.packages", ",".join(packages))\
    .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")\
    .config("spark.hadoop.fs.s3a.multipart.size", 104857600)\
    .getOrCreate()


df = spark.read.format('mongo').option('spark.mongodb.input.uri',
                                       'mongodb://127.0.0.10:27017/wevow_scrape.hotel_info').load()


df_club_info = spark.read.format('mongo').option(
    'spark.mongodb.input.uri', 'mongodb://172.1.0.10:27017/wevow_scrape.club_info').option("encoding", "UTF-8").load()
df_club_info = df_club_info.withColumn("category", lit("club")).selectExpr(
    "name", "district", "category", "cast(max_pax as int) max_pax", "min_charge")


df_club_info.write.format('jdbc')\
    .option('url', "jdbc:postgresql://{}/{}".format(RDS_HOST, RDS_DB))\
    .option('dbtable', 'dim_banquet')\
    .option('user', RDS_USERNAME)\
    .option('password', RDS_PASSWORD)\
    .option('driver', 'org.postgresql.Driver')\
    .mode('append')\
    .save()
