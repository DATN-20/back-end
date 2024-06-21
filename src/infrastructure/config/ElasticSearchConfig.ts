import { get } from 'env-var';

export class ElasticSearchConfig {
  public static readonly ELASTICSEARCH_URL: string = get('ELASTICSEARCH_URL')
    .default('http://localhost:9200')
    .asString();
}
