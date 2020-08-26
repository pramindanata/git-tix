import React from 'react';
import { RequestValidationError, ActionFailError } from '~/utils';

interface RequestValidationErrorProps {
  error: RequestValidationError;
}

interface ActionFailErrorProps {
  error: ActionFailError;
}

export const RequestValidationAlert: React.FC<RequestValidationErrorProps> = (
  props,
) => {
  const { error } = props;

  return (
    <div className="alert alert-danger">
      <ul className="mb-0">
        {error.serialize().map((error) => (
          <li key={error.field}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
};

export const ActionFailAlert: React.FC<ActionFailErrorProps> = (props) => {
  const { error } = props;

  return (
    <div className="alert alert-danger">
      <div>{error.serialize().message}</div>
    </div>
  );
};
