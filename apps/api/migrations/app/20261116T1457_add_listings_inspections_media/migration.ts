#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0ea419be4ab3cab9a7312d2c240acda3d35235d67e6b66981204609832e192b6/contract';
import endContract from '../../snapshots/0ea419be4ab3cab9a7312d2c240acda3d35235d67e6b66981204609832e192b6/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c18a6f7f80b1aac1db14c59114cda801b698abef04546a2bd7c9bcc8e77b01c0/contract';
import startContract from '../../snapshots/c18a6f7f80b1aac1db14c59114cda801b698abef04546a2bd7c9bcc8e77b01c0/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'agentAvailability',
        columns: [
          col('agentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('dayOfWeek', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('endTime', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startTime', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('timezone', 'text', {
            notNull: true,
            default: lit('Africa/Lagos'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'agentAvailabilityException',
        columns: [
          col('agentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('date', 'date', { notNull: true, codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'inspection',
        columns: [
          col('cancelReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('cancelledAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('cancelledByUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('inspectorId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('inspectorKind', 'text', {
            notNull: true,
            default: lit('LISTING_AGENT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('listingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('propertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('requesterId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('scheduledAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('startedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('REQUESTED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'inspection_inspectorKind_check_16a62507',
            "\"inspectorKind\" IN ('LISTING_AGENT', 'PRODUCT_Z_AGENT')",
          ),
          checkExpression(
            'inspection_status_check_f2d1a037',
            "\"status\" IN ('REQUESTED', 'SCHEDULED', 'STARTED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'inspectionReview',
        columns: [
          col('agentRating', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('agentText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('inspectionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('propertyRating', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('propertyText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'listing',
        columns: [
          col('bathrooms', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('bedrooms', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('createdByUserId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('deletedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('displayLocation', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('expiresAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('features', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('flagReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('flaggedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('flaggedByUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('inspectionFeeDiscouraged', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('kind', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('propertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('publishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('sizeSqm', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('DRAFT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('listing_kind_check_9d7d9cf3', "\"kind\" IN ('RENT', 'SALE')"),
          checkExpression(
            'listing_status_check_adf6a6a7',
            "\"status\" IN ('DRAFT', 'ACTIVE', 'PAUSED', 'PENDING_REVIEW', 'FILLED', 'EXPIRED', 'WITHDRAWN')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'listingFee',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('currency', 'text', {
            notNull: true,
            default: lit('NGN'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('listingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'listingFee_type_check_241115d0',
            "\"type\" IN ('LEGAL', 'CAUTION', 'SERVICE_CHARGE', 'AGENCY', 'INSPECTION_FEE', 'OTHER')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'listingMedia',
        columns: [
          col('caption', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('listingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mediaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'listingPrice',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('currency', 'text', {
            notNull: true,
            default: lit('NGN'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('listingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('period', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('years', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'listingPrice_period_check_ad9da072',
            "\"period\" IN ('MONTHLY', 'YEARLY', 'TOTAL')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'listingReferral',
        columns: [
          col('anonymousId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('listingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('propertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sessionId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'media',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('createdByUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('durationSeconds', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('height', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mime', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('purpose', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('size', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('storageKey', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('width', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'media_purpose_check_00090244',
            "\"purpose\" IN ('PROPERTY_PHOTO', 'LISTING_PHOTO')",
          ),
          checkExpression(
            'media_status_check_a888db48',
            "\"status\" IN ('PENDING', 'READY', 'FAILED', 'DELETED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'propertyMedia',
        columns: [
          col('caption', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('hiddenAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('hiddenByMergeId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mediaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('propertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('source', 'text', {
            notNull: true,
            default: lit('OWNER_UPLOAD'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'propertyMedia_source_check_732038a2',
            "\"source\" IN ('OWNER_UPLOAD', 'LISTING_PROMOTED', 'OPS_CURATED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'propertyMerge',
        columns: [
          col('actorId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fromPropertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('reversedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('reversedById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('toPropertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'report',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('details', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reason', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reporterId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('resolutionNotes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('resolvedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('resolvedByUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('OPEN'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('targetId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('targetType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'report_reason_check_1997ed77',
            "\"reason\" IN ('MISREPRESENTATION', 'FRAUD', 'SPAM', 'INAPPROPRIATE_CONTENT', 'DUPLICATE_LISTING', 'OTHER')",
          ),
          checkExpression(
            'report_status_check_0cd47f74',
            "\"status\" IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED')",
          ),
          checkExpression(
            'report_targetType_check_eb96de13',
            "\"targetType\" IN ('LISTING', 'AGENT', 'PROPERTY', 'USER')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('bathrooms', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('bedrooms', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('createdByUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('isProvisional', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('mergedIntoId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('sizeSqm', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('role', 'text', {
          notNull: true,
          default: lit('USER'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'agentAvailability',
        constraint: 'agentAvailability_agentId_dayOfWeek_startTime_endTime_key',
        columns: ['agentId', 'dayOfWeek', 'startTime', 'endTime'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'agentAvailabilityException',
        constraint: 'agentAvailabilityException_agentId_date_key',
        columns: ['agentId', 'date'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'inspectionReview',
        constraint: 'inspectionReview_inspectionId_key',
        columns: ['inspectionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'listingMedia',
        constraint: 'listingMedia_listingId_mediaId_key',
        columns: ['listingId', 'mediaId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'listingPrice',
        constraint: 'listingPrice_listingId_key',
        columns: ['listingId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'propertyMedia',
        constraint: 'propertyMedia_propertyId_mediaId_key',
        columns: ['propertyId', 'mediaId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'user',
        constraint: 'user_role_check_ec757639',
        expression: "\"role\" IN ('USER', 'OPS', 'ADMIN')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'agentAvailability',
        index: 'agentAvailability_agentId_idx_8d0ba4f0',
        columns: ['agentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'agentAvailabilityException',
        index: 'agentAvailabilityException_agentId_idx_8d0ba4f0',
        columns: ['agentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inspection',
        index: 'inspection_cancelledByUserId_idx_5a0947ea',
        columns: ['cancelledByUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inspection',
        index: 'inspection_inspectorId_idx_4d86e86c',
        columns: ['inspectorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inspection',
        index: 'inspection_listingId_idx_953decda',
        columns: ['listingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inspection',
        index: 'inspection_propertyId_idx_4bcae41c',
        columns: ['propertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inspection',
        index: 'inspection_requesterId_idx_a5f4af92',
        columns: ['requesterId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inspection',
        index: 'inspection_status_scheduledAt_idx_62252894',
        columns: ['status', 'scheduledAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'inspectionReview',
        index: 'inspectionReview_agentRating_idx_0bddec50',
        columns: ['agentRating'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listing',
        index: 'listing_createdByUserId_idx_93e8a540',
        columns: ['createdByUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listing',
        index: 'listing_expiresAt_idx_6b6b8c10',
        columns: ['expiresAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listing',
        index: 'listing_flaggedByUserId_idx_0e6fd4f7',
        columns: ['flaggedByUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listing',
        index: 'listing_kind_status_idx_8034fcaa',
        columns: ['kind', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listing',
        index: 'listing_propertyId_idx_4bcae41c',
        columns: ['propertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listing',
        index: 'listing_publishedAt_idx_36121b91',
        columns: ['publishedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listing',
        index: 'listing_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingFee',
        index: 'listingFee_listingId_idx_953decda',
        columns: ['listingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingFee',
        index: 'listingFee_type_idx_b6b604ea',
        columns: ['type'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingMedia',
        index: 'listingMedia_listingId_idx_953decda',
        columns: ['listingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingMedia',
        index: 'listingMedia_listingId_sortOrder_idx_c6074c87',
        columns: ['listingId', 'sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingMedia',
        index: 'listingMedia_mediaId_idx_6b06655c',
        columns: ['mediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingReferral',
        index: 'listingReferral_anonymousId_idx_cbd7b8f6',
        columns: ['anonymousId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingReferral',
        index: 'listingReferral_listingId_idx_953decda',
        columns: ['listingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingReferral',
        index: 'listingReferral_propertyId_idx_4bcae41c',
        columns: ['propertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingReferral',
        index: 'listingReferral_sessionId_idx_29f415d4',
        columns: ['sessionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'listingReferral',
        index: 'listingReferral_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'media',
        index: 'media_createdByUserId_idx_93e8a540',
        columns: ['createdByUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'media',
        index: 'media_purpose_idx_73d3df4c',
        columns: ['purpose'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'media',
        index: 'media_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'property',
        index: 'property_createdByUserId_idx_93e8a540',
        columns: ['createdByUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'property',
        index: 'property_mergedIntoId_idx_470bd53d',
        columns: ['mergedIntoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMedia',
        index: 'propertyMedia_hiddenByMergeId_idx_5b5baac8',
        columns: ['hiddenByMergeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMedia',
        index: 'propertyMedia_mediaId_idx_6b06655c',
        columns: ['mediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMedia',
        index: 'propertyMedia_propertyId_idx_4bcae41c',
        columns: ['propertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMedia',
        index: 'propertyMedia_propertyId_sortOrder_idx_ec276bcd',
        columns: ['propertyId', 'sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMerge',
        index: 'propertyMerge_actorId_idx_a58f6b4b',
        columns: ['actorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMerge',
        index: 'propertyMerge_fromPropertyId_idx_4ecd9e78',
        columns: ['fromPropertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMerge',
        index: 'propertyMerge_reversedAt_idx_6f1bc01c',
        columns: ['reversedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMerge',
        index: 'propertyMerge_reversedById_idx_5a069f71',
        columns: ['reversedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyMerge',
        index: 'propertyMerge_toPropertyId_idx_f325b462',
        columns: ['toPropertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'report',
        index: 'report_reporterId_idx_aa245831',
        columns: ['reporterId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'report',
        index: 'report_resolvedByUserId_idx_fe6c7b89',
        columns: ['resolvedByUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'report',
        index: 'report_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'report',
        index: 'report_targetType_targetId_idx_7a5ee9cb',
        columns: ['targetType', 'targetId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'agentAvailability',
        foreignKey: {
          name: 'agentAvailability_agentId_fkey',
          columns: ['agentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'agentAvailabilityException',
        foreignKey: {
          name: 'agentAvailabilityException_agentId_fkey',
          columns: ['agentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inspection',
        foreignKey: {
          name: 'inspection_propertyId_fkey',
          columns: ['propertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inspection',
        foreignKey: {
          name: 'inspection_listingId_fkey',
          columns: ['listingId'],
          references: { schema: 'public', table: 'listing', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inspection',
        foreignKey: {
          name: 'inspection_requesterId_fkey',
          columns: ['requesterId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inspection',
        foreignKey: {
          name: 'inspection_inspectorId_fkey',
          columns: ['inspectorId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inspection',
        foreignKey: {
          name: 'inspection_cancelledByUserId_fkey',
          columns: ['cancelledByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inspectionReview',
        foreignKey: {
          name: 'inspectionReview_inspectionId_fkey',
          columns: ['inspectionId'],
          references: { schema: 'public', table: 'inspection', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listing',
        foreignKey: {
          name: 'listing_propertyId_fkey',
          columns: ['propertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listing',
        foreignKey: {
          name: 'listing_createdByUserId_fkey',
          columns: ['createdByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listing',
        foreignKey: {
          name: 'listing_flaggedByUserId_fkey',
          columns: ['flaggedByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listingFee',
        foreignKey: {
          name: 'listingFee_listingId_fkey',
          columns: ['listingId'],
          references: { schema: 'public', table: 'listing', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listingMedia',
        foreignKey: {
          name: 'listingMedia_listingId_fkey',
          columns: ['listingId'],
          references: { schema: 'public', table: 'listing', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listingMedia',
        foreignKey: {
          name: 'listingMedia_mediaId_fkey',
          columns: ['mediaId'],
          references: { schema: 'public', table: 'media', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listingPrice',
        foreignKey: {
          name: 'listingPrice_listingId_fkey',
          columns: ['listingId'],
          references: { schema: 'public', table: 'listing', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listingReferral',
        foreignKey: {
          name: 'listingReferral_listingId_fkey',
          columns: ['listingId'],
          references: { schema: 'public', table: 'listing', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listingReferral',
        foreignKey: {
          name: 'listingReferral_propertyId_fkey',
          columns: ['propertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listingReferral',
        foreignKey: {
          name: 'listingReferral_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'listingReferral',
        foreignKey: {
          name: 'listingReferral_sessionId_fkey',
          columns: ['sessionId'],
          references: { schema: 'public', table: 'session', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'media',
        foreignKey: {
          name: 'media_createdByUserId_fkey',
          columns: ['createdByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'property',
        foreignKey: {
          name: 'property_createdByUserId_fkey',
          columns: ['createdByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'property',
        foreignKey: {
          name: 'property_mergedIntoId_fkey',
          columns: ['mergedIntoId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyMedia',
        foreignKey: {
          name: 'propertyMedia_propertyId_fkey',
          columns: ['propertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyMedia',
        foreignKey: {
          name: 'propertyMedia_mediaId_fkey',
          columns: ['mediaId'],
          references: { schema: 'public', table: 'media', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyMedia',
        foreignKey: {
          name: 'propertyMedia_hiddenByMergeId_fkey',
          columns: ['hiddenByMergeId'],
          references: { schema: 'public', table: 'propertyMerge', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyMerge',
        foreignKey: {
          name: 'propertyMerge_fromPropertyId_fkey',
          columns: ['fromPropertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyMerge',
        foreignKey: {
          name: 'propertyMerge_toPropertyId_fkey',
          columns: ['toPropertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyMerge',
        foreignKey: {
          name: 'propertyMerge_actorId_fkey',
          columns: ['actorId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyMerge',
        foreignKey: {
          name: 'propertyMerge_reversedById_fkey',
          columns: ['reversedById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'report',
        foreignKey: {
          name: 'report_reporterId_fkey',
          columns: ['reporterId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'report',
        foreignKey: {
          name: 'report_resolvedByUserId_fkey',
          columns: ['resolvedByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
