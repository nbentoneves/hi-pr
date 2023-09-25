import { Configuration } from 'src/store/feature/githubSlice';
import { v4 as uuidv4 } from 'uuid';
import { FormValues } from '..';

const domainToForm = (configuration: Configuration): FormValues => ({
  isEnabled: configuration.enabled,
  isOrganizationOwner: configuration.isOrganizationOwner,
  name: configuration.name,
  username: configuration.username,
  type: configuration.type,
  followBy: configuration.followBy,
  token: configuration.token,
  owner: configuration.owner,
  repository: configuration.repository,
});

const mappingFormValues = (
  isNewConfiguration: boolean,
  values: FormValues,
  identifier?: string,
): Configuration => ({
  identifier: isNewConfiguration ? uuidv4() : identifier ?? '',
  isOrganizationOwner: values.isOrganizationOwner,
  name: values.name,
  enabled: values.isEnabled,
  type: values.type,
  username: values.username,
  owner: values.owner,
  followBy: values.followBy,
  token: values.token,
  repository: values.repository,
});

const mappingFromValuesNewConfiguration = (values: FormValues): Configuration =>
  mappingFormValues(true, values);

const mappingFromValuesEditConfiguration = (
  identifier: string,
  values: FormValues,
): Configuration => mappingFormValues(false, values, identifier);

export const MappingConfigurationForm = {
  domainToForm,
  mappingFromValuesNewConfiguration,
  mappingFromValuesEditConfiguration,
};
