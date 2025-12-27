import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseMetadata {
  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'req_abc123xyz' })
  requestId?: string;

  @ApiProperty({ required: false })
  pagination?: PaginationMetadata;
}

export class PaginationMetadata {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrevious: boolean;
}

export class ApiSuccessResponse<T> {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  data: T;

  @ApiProperty({ type: ApiResponseMetadata })
  metadata: ApiResponseMetadata;
}

export class ApiErrorDetails {
  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code: string;

  @ApiProperty({ example: 'Validation failed for the request' })
  message: string;

  @ApiProperty({ required: false })
  details?: any;

  @ApiProperty({ required: false, example: ['price must be a positive number'] })
  validationErrors?: string[];
}

export class ApiErrorResponse {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ type: ApiErrorDetails })
  error: ApiErrorDetails;

  @ApiProperty({ type: ApiResponseMetadata })
  metadata: ApiResponseMetadata;
}

/**
 * Helper function to create success response
 */
export function createSuccessResponse<T>(
  data: T,
  metadata?: Partial<ApiResponseMetadata>
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };
}

/**
 * Helper function to create paginated success response
 */
export function createPaginatedResponse<T>(
  data: T,
  pagination: PaginationMetadata,
  metadata?: Partial<ApiResponseMetadata>
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      pagination,
      ...metadata,
    },
  };
}

/**
 * Helper function to calculate pagination metadata
 */
export function calculatePaginationMetadata(
  page: number,
  limit: number,
  total: number
): PaginationMetadata {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
