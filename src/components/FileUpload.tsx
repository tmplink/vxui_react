import type { DragEvent } from 'react';
import { useState, useRef, useCallback } from 'react';
import { Upload, X, File } from 'lucide-react';
import { cx } from '../lib/cx';

export interface UploadedFile {
  file: File;
  id: string;
}

export interface FileUploadProps {
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
  /** Max file size in bytes */
  maxSize?: number;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  label,
  hint,
  error,
  accept,
  multiple = false,
  maxSize,
  disabled,
  onFiles,
  className,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [sizeError, setSizeError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming);
      if (maxSize) {
        const oversized = arr.filter((f) => f.size > maxSize);
        if (oversized.length > 0) {
          setSizeError(`File too large (max ${(maxSize / 1024 / 1024).toFixed(1)} MB)`);
          return;
        }
      }
      setSizeError(undefined);
      const newFiles: UploadedFile[] = arr.map((f) => ({
        file: f,
        id: crypto.randomUUID(),
      }));
      const updated = multiple ? [...uploadedFiles, ...newFiles] : newFiles;
      setUploadedFiles(updated);
      onFiles?.(updated.map((u) => u.file));
    },
    [uploadedFiles, maxSize, multiple, onFiles],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) processFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };

  const removeFile = (id: string) => {
    const updated = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(updated);
    onFiles?.(updated.map((u) => u.file));
  };

  const displayError = error ?? sizeError;

  return (
    <div className={cx('vx-file-upload', className)}>
      {label ? <span className="vx-field-group__label">{label}</span> : null}
      <div
        className={cx(
          'vx-file-upload__zone',
          dragging && 'vx-file-upload__zone--dragging',
          disabled && 'vx-file-upload__zone--disabled',
          displayError && 'vx-file-upload__zone--invalid',
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragging(false)}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        aria-label="Upload files, click or drag and drop"
      >
        <Upload size={24} className="vx-file-upload__icon" />
        <p className="vx-file-upload__text">
          <span className="vx-file-upload__link">Click to upload</span> or drag and drop
        </p>
        {hint ? <p className="vx-file-upload__hint">{hint}</p> : null}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="vx-file-upload__input"
          onChange={(e) => processFiles(e.target.files)}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      {displayError ? <span className="vx-field-group__error">{displayError}</span> : null}
      {uploadedFiles.length > 0 && (
        <ul className="vx-file-upload__list">
          {uploadedFiles.map(({ id, file }) => (
            <li key={id} className="vx-file-upload__file">
              <File size={14} className="vx-file-upload__file-icon" />
              <span className="vx-file-upload__file-name">{file.name}</span>
              <span className="vx-file-upload__file-size">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                className="vx-file-upload__remove"
                onClick={() => removeFile(id)}
                aria-label={`Remove ${file.name}`}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
